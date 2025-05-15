import React, { useEffect, useState } from 'react';
import { restaurantService } from '../../api';

const RestaurantSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState('checking');
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkSyncStatus = async () => {
    setIsLoading(true);
    setSyncStatus('checking');
    setError(null);
    
    try {
      // Get restaurant details
      const restaurant = await restaurantService.getRestaurantDetails();
      setRestaurant(restaurant);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error checking restaurant sync:', error);
      setError('Could not fetch restaurant details');
      setSyncStatus('error');
      
      // If restaurant not found, try to sync it
      if (error.response?.status === 404) {
        try {
          await restaurantService.syncRestaurantData();
          // Try again to get restaurant details after sync
          const syncedRestaurant = await restaurantService.getRestaurantDetails();
          setRestaurant(syncedRestaurant);
          setSyncStatus('synced');
          setError(null);
        } catch (syncError) {
          console.error('Sync failed:', syncError);
          setError('Restaurant sync failed. Please try again later.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkSyncStatus();
  }, []);
  
  const handleSyncNow = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await restaurantService.syncRestaurantData();
      const updatedRestaurant = await restaurantService.getRestaurantDetails();
      setRestaurant(updatedRestaurant);
      setSyncStatus('synced');
    } catch (error) {
      console.error('Manual sync failed:', error);
      setError('Restaurant sync failed. Please try again later.');
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="restaurant-sync-status loading">Loading restaurant details...</div>;
  }
  
  if (error && !restaurant) {
    return (
      <div className="restaurant-sync-status error">
        <h3>Restaurant Sync Issue</h3>
        <p>{error}</p>
        <button onClick={handleSyncNow} disabled={isLoading}>
          {isLoading ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    );
  }
  
  if (!restaurant) {
    return null;
  }
  
  return (
    <div className="restaurant-sync-status">
      <h3>Restaurant Details</h3>
      <div className="restaurant-details">
        <p><strong>Name:</strong> {restaurant.name}</p>
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>Phone:</strong> {restaurant.phone}</p>
        <p><strong>Email:</strong> {restaurant.email}</p>
        <p><strong>Status:</strong> {restaurant.active ? 'Active' : 'Inactive'}</p>
      </div>
      <button onClick={handleSyncNow} disabled={isLoading}>
        {isLoading ? 'Syncing...' : 'Refresh Restaurant Data'}
      </button>
    </div>
  );
};

export default RestaurantSyncStatus;