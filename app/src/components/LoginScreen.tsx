import { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAppStore } from '../store/appStore';
import { db, type User } from '../db/db';
import { seedIfEmpty } from '../db/seed';
import { checkSupervisorAuth } from '../lib/auth';
import { loadUserSession } from '../lib/session';
import StudioIcon from './StudioIcon';
import OnboardingWizard from './OnboardingWizard';

type Role = 'patient' | 'supervisor' | null;

export default function LoginScreen() {
  const { setScreen } = useAppStore();
  const [role, setRole] = useState<Role>(null);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [supervisorPatient, setSupervisorPatient] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [patientPin, setPatientPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const patients = useLiveQuery(() => db.users.toArray(), []) ?? [];

  useEffect(() => {
    void seedIfEmpty();
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const enterApp = (target: 'patient' | 'supervisor') => {
    setScreen(target);
  };

  const handlePatientLogin = async (patient: User) => {
    await seedIfEmpty();
    await loadUserSession(patient);
    enterApp('patient');
  };

  const handleSupervisorLogin = async () => {
    const auth = checkSupervisorAuth(password);
    if (!auth.ok) { setError(auth.error ?? 'Incorrect password.'); return; }
    if (!supervisorPatient) { setError('Please select a patient to monitor.'); return; }
    setError('');
    await seedIfEmpty();
    await loadUserSession(supervisorPatient);
    enterApp('supervisor');
  };

  if (showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={async (patient) => {
          setShowOnboarding(false);
          await loadUserSession(patient);
          enterApp('patient');
        }}
        onCancel={() => setShowOnboarding(false)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="apple-login"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)' }}
    >
      <div className="apple-login__top">
        <div className="apple-login__wordmark">Recall</div>
        <p className="apple-login__tagline">Memory, medication &amp; moments.</p>
      </div>

      <div className="apple-login__card">
        {role === null && (
          <div className="apple-login__step">
            <p className="apple-login__eyebrow">Sign in</p>
            <p className="apple-login__title">Who's using Recall?</p>
            <div className="apple-login__actions">
              <button
                className="apple-btn apple-btn--primary"
                onClick={() => { setRole('patient'); setSelectedPatient(null); }}
              >
                <StudioIcon name="user" size={20} />
                <span className="apple-btn__label">Patient</span>
                <span className="apple-btn__hint">Daily care</span>
              </button>
              <button
                className="apple-btn apple-btn--secondary"
                onClick={() => { setRole('supervisor'); setSupervisorPatient(null); }}
              >
                <StudioIcon name="profile" size={20} />
                <span className="apple-btn__label">Supervisor</span>
                <span className="apple-btn__hint">Caregiver access</span>
              </button>
            </div>
          </div>
        )}

        {role === 'patient' && !selectedPatient && (
          <div className="apple-login__step">
            <p className="apple-login__eyebrow">Patient</p>
            <p className="apple-login__title">Who are you today?</p>
            <div className="apple-login__actions">
              {patients.map((p) => (
                <button
                  key={p.id}
                  className="apple-btn apple-btn--user"
                  onClick={() => setSelectedPatient(p)}
                >
                  <span className="apple-btn__avatar">
                    {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <span className="apple-btn__label">{p.name}</span>
                  <span className="apple-btn__hint">{p.city}</span>
                </button>
              ))}
              <button className="apple-btn apple-btn--ghost" onClick={() => setShowOnboarding(true)}>
                <StudioIcon name="add" size={18} />
                <span className="apple-btn__label">Set up new profile</span>
              </button>
              <button className="apple-btn apple-btn--text" onClick={() => { setRole(null); }}>
                Back
              </button>
            </div>
          </div>
        )}

        {role === 'patient' && selectedPatient && (
          <div className="apple-login__step">
            <p className="apple-login__eyebrow">Patient</p>
            <p className="apple-login__title">Welcome back,<br />{selectedPatient.name.split(' ')[0]}</p>
            <div className="apple-login__actions">
              {selectedPatient.patientPin && (
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={patientPin}
                  onChange={(e) => { setPatientPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                  placeholder="Enter your PIN"
                  className="apple-input"
                  autoFocus
                />
              )}
              {pinError && <p className="apple-error">{pinError}</p>}
              <button
                className="apple-btn apple-btn--primary"
                onClick={() => {
                  if (selectedPatient.patientPin && patientPin !== selectedPatient.patientPin) {
                    setPinError('Incorrect PIN. Try again.');
                    return;
                  }
                  handlePatientLogin(selectedPatient);
                }}
              >
                <span className="apple-btn__label">Enter Dashboard</span>
              </button>
              <button className="apple-btn apple-btn--text" onClick={() => { setSelectedPatient(null); setPatientPin(''); setPinError(''); }}>
                Back
              </button>
            </div>
          </div>
        )}

        {role === 'supervisor' && !supervisorPatient && (
          <div className="apple-login__step">
            <p className="apple-login__eyebrow">Supervisor</p>
            <p className="apple-login__title">Who are you caring for?</p>
            <div className="apple-login__actions">
              {patients.map((p) => (
                <button
                  key={p.id}
                  className="apple-btn apple-btn--user"
                  onClick={() => setSupervisorPatient(p)}
                >
                  <span className="apple-btn__avatar">
                    {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <span className="apple-btn__label">{p.name}</span>
                  <span className="apple-btn__hint">{p.city}</span>
                </button>
              ))}
              <button className="apple-btn apple-btn--text" onClick={() => { setRole(null); }}>
                Back
              </button>
            </div>
          </div>
        )}

        {role === 'supervisor' && supervisorPatient && (
          <div className="apple-login__step">
            <p className="apple-login__eyebrow">Supervisor</p>
            <p className="apple-login__title">Signing in for<br />{supervisorPatient.name.split(' ')[0]}</p>
            <div className="apple-login__actions">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSupervisorLogin()}
                placeholder="Password"
                className="apple-input"
                autoFocus
              />
              {error && <p className="apple-error">{error}</p>}
              <button className="apple-btn apple-btn--primary" onClick={handleSupervisorLogin}>
                <span className="apple-btn__label">Sign In</span>
              </button>
              <button className="apple-btn apple-btn--text" onClick={() => { setSupervisorPatient(null); setPassword(''); setError(''); }}>
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
