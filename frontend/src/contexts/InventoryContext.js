import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Default stock threshold
  const DEFAULT_THRESHOLD = 10;

  // Helper function to determine stock status
  const getStockStatus = (stock, threshold = DEFAULT_THRESHOLD) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= threshold / 3) return "critical";
    if (stock <= threshold / 2) return "very-low";
    if (stock <= threshold) return "low";
    return "safe";
  };

  // Function to check and generate alerts
  const checkInventoryAlerts = useCallback(() => {
    const newAlerts = [];
    
    inventory.forEach(item => {
      const threshold = item.threshold || DEFAULT_THRESHOLD;
      const status = getStockStatus(item.stock, threshold);
      
      if (status === "out-of-stock") {
        newAlerts.push({
          id: `out-of-stock-${item.id}`,
          type: 'out-of-stock',
          message: `"${item.name || item.title}" is currently OUT OF STOCK and requires immediate restocking.`,
          item: item,
          priority: 1,
          timestamp: new Date()
        });
      } else if (status === "critical") {
        newAlerts.push({
          id: `critical-${item.id}`,
          type: 'critical',
          message: `"${item.name || item.title}" has reached CRITICAL stock level (${item.stock} units remaining).`,
          item: item,
          priority: 2,
          timestamp: new Date()
        });
      } else if (status === "very-low") {
        newAlerts.push({
          id: `very-low-${item.id}`,
          type: 'very-low',
          message: `"${item.name || item.title}" has very low stock (${item.stock} units remaining).`,
          item: item,
          priority: 3,
          timestamp: new Date()
        });
      } else if (status === "low") {
        newAlerts.push({
          id: `low-${item.id}`,
          type: 'low',
          message: `"${item.name || item.title}" has low stock (${item.stock} units remaining).`,
          item: item,
          priority: 4,
          timestamp: new Date()
        });
      }
    });
    
    // Sort by priority (most critical first)
    newAlerts.sort((a, b) => a.priority - b.priority);
    setAlerts(newAlerts);
    setLastUpdated(new Date());
  }, [inventory]);

  // Update inventory item
  const updateInventoryItem = useCallback((itemId, updates) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, lastUpdated: new Date().toISOString() }
          : item
      )
    );
  }, []);

  // Add new inventory item
  const addInventoryItem = useCallback((newItem) => {
    const item = {
      ...newItem,
      id: newItem.id || Date.now(),
      threshold: newItem.threshold || DEFAULT_THRESHOLD,
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setInventory(prev => [...prev, item]);
  }, []);

  // Remove inventory item
  const removeInventoryItem = useCallback((itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Sync with products from API
  const syncWithProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/products');
      if (response.ok) {
        const products = await response.json();
        const inventoryItems = products.map(product => ({
          id: product._id || product.id,
          name: product.name,
          title: product.name, // For backward compatibility
          author: product.supplier || 'Unknown',
          category: product.category,
          stock: parseInt(product.stockCurrent) || 0,
          threshold: product.threshold || DEFAULT_THRESHOLD,
          price: parseFloat(product.price) || 0,
          supplier: product.supplier,
          status: product.status,
          code: product.code,
          lastUpdated: new Date().toISOString()
        }));
        setInventory(inventoryItems);
      }
    } catch (error) {
      console.error('Error syncing with products:', error);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (error) {
        console.error('Error loading inventory from localStorage:', error);
        // Fallback to syncing with products
        syncWithProducts();
      }
    } else {
      // Initial sync with products
      syncWithProducts();
    }
  }, [syncWithProducts]);

  // Save to localStorage when inventory changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Check alerts whenever inventory changes
  useEffect(() => {
    checkInventoryAlerts();
  }, [checkInventoryAlerts]);

  // Dismiss specific alert
  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value = {
    inventory,
    alerts,
    lastUpdated,
    updateInventoryItem,
    addInventoryItem,
    removeInventoryItem,
    syncWithProducts,
    checkInventoryAlerts,
    dismissAlert,
    clearAllAlerts,
    getStockStatus
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
