import React, { useState } from 'react';
import axios from 'axios';

function Book_car() {
  const [numDatasets, setNumDatasets] = useState(1);
  const [formData, setFormData] = useState([]);

  const handleNumDatasetsChange = (event) => {
    const { value } = event.target;
    setNumDatasets(value);
    setFormData([...Array(Number(value))].map(() => ({})));
  };

  const handleChange = (event, index) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [name]: files ? files[0] : value, // ถ้ามีไฟล์ให้ใช้ files[0] มิฉะนั้นใช้ value
      };
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    const formdata = new FormData();
    formData.forEach((data) => {
      Object.keys(data).forEach((key) => {
        formdata.append(key, data[key]);
      });
    });

    try {
      const response = await axios.post('http://localhost:4001/product/postproducts', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Data submitted successfully!', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div>
      <label>จำนวนชุดข้อมูล: </label>
      <input
        type="number"
        value={numDatasets}
        onChange={handleNumDatasetsChange}
      />

      {Array.from({ length: numDatasets }, (_, index) => (
        <div key={index}>
          <input
            type="text"
            name="nameProduct"
            placeholder={`ชุดข้อมูลที่ ${index + 1}`}
            onChange={(event) => handleChange(event, index)}
          />
          <input
            type="file"
            name="imageProduct"
            onChange={(event) => handleChange(event, index)}
          />
          <input
            type="text"
            name="priceProduct"
            onChange={(event) => handleChange(event, index)}
          />
          <input
            type="text"
            name="descriptionProduct"
            onChange={(event) => handleChange(event, index)}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Book_car;
