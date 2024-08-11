import { useState } from 'react';
import Step1 from './RentalSteps/Step1';
import Step2 from './RentalSteps/Step2';
import Step3 from './RentalSteps/Step3';
import Step4 from './RentalSteps/Step4';

function SpaceRental({ space }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [rentalData, setRentalData] = useState({
    unit: '',
    location: '',
    dateTime: '',
    phone: '',
    email: '',
    reason: '',
    renter: ''
  });

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (input) => (e) => {
    setRentalData({ ...rentalData, [input]: e.target.value });
  };

  switch (currentStep) {
    case 1:
      return <Step1 nextStep={nextStep} setRentalData={setRentalData} spaceName={space.spaceName} />;
    case 2:
      return <Step2
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                rentalData={rentalData}
              />;
    case 3:
      return <Step3
                nextStep={nextStep}
                prevStep={prevStep}
                rentalData={rentalData}
              />;
    case 4:
      return <Step4 rentalData={rentalData} />; // Pass rentalData as a prop
    default:
      return <Step1 nextStep={nextStep} setRentalData={setRentalData} spaceName={space.spaceName} />;
  }
}

export default SpaceRental;
