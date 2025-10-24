import logo from '../assets/logo.png'; // replace with your logo path

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(0,0,0,0.7)', // semi-transparent dark header
        color: 'white',
        position: 'fixed', // stays on top
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo + App Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" style={{ height: '40px' }} />
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Travel Planner</h1>
      </div>

      
    </header>
  );
}
