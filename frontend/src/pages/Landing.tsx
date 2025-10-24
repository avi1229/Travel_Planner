import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import landingBg from '../assets/landing.jpg';

export default function Landing() {
  const navigate = useNavigate();

  return (
         <div 
      style={{ 
        backgroundImage: `url(${landingBg})`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat', // Adjust as needed
        height: '100vh', // Example height
         display: 'flex',   
        justifyContent:'center',
        alignItems: 'center'
      }}
    >
        <Card
          title="Try Before You Fly"
          className="text-center w-6  p-4 border-round-xl shadow-5"
          
        >
          <p className="text-lg mb-4">Experience immersive travel planning — Try a destination in 360°</p>
          <Button label="Try Now" icon="pi pi-globe" onClick={() => navigate('/planner')} />
        </Card>
      </div>

  );
}
