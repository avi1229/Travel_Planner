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
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',             // Flex container
    justifyContent: 'center',    // Horizontal center
    alignItems: 'center',        // Vertical center
  }}
>
  <Card
    title={`Destination #${id}`}
    className="w-8"
    style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent
      padding: '2rem',
      borderRadius: '8px'
    }}
  >
    <p>360° Preview (Coming Soon)</p>
    <div className="flex justify-content-between mt-4">
      <Button label="Add to Itinerary" icon="pi pi-plus" onClick={() => navigate('/itinerary')} />
      <Button label="Back to Planner" icon="pi pi-arrow-left" outlined onClick={() => navigate('/planner')} />
    </div>
  </Card>
</div>

  );
}
