import { useState } from 'react';
import Step1 from './RentalSteps/Step1';
import Step2 from './RentalSteps/Step2';
import Step3 from './RentalSteps/Step3';
import Step4 from './RentalSteps/Step4';
import axios from 'axios';

function SpaceRental({ space, handleClose }) {  // 接收 handleClose prop
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
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));  // 确保最多到Step4
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));  // 确保最少到Step1
  };

  const handleChange = (input) => (e) => {
    setRentalData({ ...rentalData, [input]: e.target.value });
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post('http://localhost:8080/spaceRentals', {
        spaceRentalUnit: rentalData.unit,
        spaceRentalLocation: rentalData.location,
        spaceRentalDateTime: rentalData.dateTime,
        spaceRentalPhone: rentalData.phone,
        spaceRentalEmail: rentalData.email,
        spaceRentalReason: rentalData.reason,
        spaceRentalRenter: rentalData.renter,
      });

      console.log('POST response:', response.data);
      setCurrentStep(4); // 直接将 currentStep 设置为 4，进入 Step4
    } catch (error) {
      console.error('POST error:', error);
    }
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
                handleConfirm={handleConfirm} // 傳遞 handleConfirm 函數
              />;
    case 4:
      return <Step4 rentalData={rentalData} handleClose={handleClose} />; // 傳遞 handleClose 到 Step4
    default:
      return <Step1 nextStep={nextStep} setRentalData={setRentalData} spaceName={space.spaceName} />;
  }
}

export default SpaceRental;
