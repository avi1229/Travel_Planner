import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const items = [
    { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
    { label: 'Planner', icon: 'pi pi-compass', command: () => navigate('/planner') },
    { label: 'Admin', icon: 'pi pi-cog', command: () => navigate('/admin') },
  ];

  return (
    <Menubar
      model={items}
      style={{
        position: 'sticky', 
        top: '64px',       
        zIndex: 999,
        backgroundColor: 'rgba(249, 244, 244, 0.85)',
        color: 'black',
      }}
    />
  );
}
