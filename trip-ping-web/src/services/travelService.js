import { apiRequest } from './httpClient'

export const travelService = {
  identifyUser(email) {
    return apiRequest('/users/identify', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  registerUser(user) {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  },

  listTrips(userId) {
    return apiRequest(`/users/${encodeURIComponent(userId)}/trips`)
  },

  createTrip(userId, trip) {
    return apiRequest(`/users/${encodeURIComponent(userId)}/trips`, {
      method: 'POST',
      body: JSON.stringify(trip),
    })
  },

  updateTrip(tripId, trip) {
    return apiRequest(`/trips/${encodeURIComponent(tripId)}`, {
      method: 'PUT',
      body: JSON.stringify(trip),
    })
  },

  deleteTrip(tripId) {
    return apiRequest(`/trips/${encodeURIComponent(tripId)}`, {
      method: 'DELETE',
    })
  },
}
