import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import itineraryBg from '../assets/itinerary.png';

export default function Itinerary() {
  return (
    <div 
      style={{ 
        backgroundImage: `url(${itineraryBg})`, 
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat', // Adjust as needed
        height: '100vh', // Example height
        justifyContent:'center',
        alignItems: 'center'
      }}
    >
    <Card title="Your Itinerary" className="w-8 mx-auto">
      <p>AI-suggested itinerary with 360° thumbnails (coming soon)</p>
      <div className="flex justify-content-end mt-3">
        <Button label="Book via Partner" icon="pi pi-check" />
      </div>
    </Card>
    </div>
  );
}
