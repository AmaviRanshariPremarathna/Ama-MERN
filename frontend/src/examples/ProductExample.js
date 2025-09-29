// Example usage in Product.js or any CRUD component
import React, { useState } from 'react';
import useAPI from '../hooks/useAPI';

const ProductExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  const {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error
  } = useAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      // Dashboard will automatically update!
      setFormData({ name: '', category: '', price: '', quantity: '' });
      alert('Product created successfully! Dashboard updated.');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateProduct(id, updatedData);
      // Dashboard will automatically update!
      alert('Product updated successfully! Dashboard updated.');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      // Dashboard will automatically update!
      alert('Product deleted successfully! Dashboard updated.');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      
      {error && <div className="error">Error: {error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>

      {/* Example of update and delete buttons */}
      <div className="product-actions">
        <button 
          onClick={() => handleUpdate('product-id', { name: 'Updated Product' })}
          disabled={loading}
        >
          Update Sample Product
        </button>
        <button 
          onClick={() => handleDelete('product-id')}
          disabled={loading}
        >
          Delete Sample Product
        </button>
      </div>
    </div>
  );
};

export default ProductExample;