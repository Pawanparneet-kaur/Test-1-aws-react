import React, { useState, useEffect } from 'react';
import './App.css';
import Amplify, { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const initialState = {
  name: '',
  description: '',
  price: '',
  image: '',
};

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  async function fetchFoodItems() {
    try {
      const foodItemData = await API.graphql(graphqlOperation(listFoodItems));
      const foodItems = foodItemData.data.listFoodItems.items;
      setFoodItems(foodItems);
    } catch (err) {
      console.log('error fetching food items', err);
    }
  }

  async function createFoodItem() {
    if (!formState.name || !formState.price) return;
    try {
      await API.graphql(graphqlOperation(createFoodItem, { input: formState }));
      if (formState.image) {
        const image = await Storage.get(formState.image);
        formState.image = image;
      }
      setFoodItems([...foodItems, formState]);
      setFormState(initialState);
    } catch (err) {
      console.log('error creating food item:', err);
    }
  }

  function onChange(e) {
    e.persist();
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    const fileName = file.name;
    try {
      await Storage.put(fileName, file);
      setFormState((prevState) => ({ ...prevState, image: fileName }));
      console.log('successfully uploaded file!');
    } catch (err) {
      console.log('error uploading file:', err);
    }
  }

  return (
    <div className='App'>
      <h1>Shopping List</h1>
      <input
        onChange={onChange}
        name='name'
        placeholder='Food Item Name'
        value={formState.name}
      />
      <input
        onChange={onChange}
        name='description'
        placeholder='Description'
        value={formState.description}
      />
      <input
        onChange={onChange}
        name='price'
        type='number'
        placeholder='Price'
        value={formState.price}
      />
      <input type='file' onChange={uploadImage} />
      <button onClick={createFoodItem}>Add Food Item</button>
      <div style={{ marginBottom: 30 }}>
        {foodItems.map((item) => (
          <div key={item.id || item.name}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>{item.price}</p>
            {item.image && (
              <img
                src={item.image}
                style={{ width: 400 }}
                alt='Food Item Image'
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
