import { useAppStore } from '../store/appStore';
import StudioIcon from './StudioIcon';

export default function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className="studio-icon-btn tap-feedback theme-toggle"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={isLight}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      <StudioIcon name={isLight ? 'moon' : 'sun'} size={18} />
    </button>
  );
}
