import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import destBg from '../assets/360.png';

export default function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div 
      style={{ 
        backgroundImage: `url(${destBg})`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat', // Adjust as needed
        height: '100vh', // Example height
      }}
    >
    <Card title={`Destination #${id}`} className="w-8 mx-auto mt-4">
      <p>360° Preview (Coming Soon)</p>
      <div className="flex justify-content-between mt-4">
        <Button label="Add to Itinerary" icon="pi pi-plus" onClick={() => navigate('/itinerary')} />
        <Button label="Back to Planner" icon="pi pi-arrow-left" outlined onClick={() => navigate('/planner')} />
      </div>
    </Card>
    </div>
  );
}
