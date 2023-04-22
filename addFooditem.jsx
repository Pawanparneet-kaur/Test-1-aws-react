import { useState } from 'react';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { createFoodItem } from './graphql/mutations';

const AddFoodItem = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const result = await Storage.put(file.name, file, { contentType: file.type });
    setImage(result.key);
  };

  const handleAddFoodItem = async (e) => {
    e.preventDefault();
    const input = {
      name,
      description,
      price: parseFloat(price),
      image,
    };
    await API.graphql(graphqlOperation(createFoodItem, { input }));
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
  };

  return (
    <form onSubmit={handleAddFoodItem}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} />
      </div>
      <button type="submit">Add Food Item</button>
    </form>
  );
};

export default AddFoodItem;

