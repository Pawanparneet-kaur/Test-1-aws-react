import { API, graphqlOperation } from 'aws-amplify'
import { createFoodItem, updateFoodItem, deleteFoodItem } from './graphql/mutations'
import { listFoodItems } from './graphql/queries'

export async function addFoodItem(foodItem) {
  return await API.graphql(graphqlOperation(createFoodItem, { input: foodItem }))
}

export async function updateFoodItemById(id, foodItem) {
  return await API.graphql(graphqlOperation(updateFoodItem, { input: { id, ...foodItem } }))
}

export async function deleteFoodItemById(id) {
  return await API.graphql(graphqlOperation(deleteFoodItem, { input: { id } }))
}

export async function listFoodItems() {
  return await API.graphql(graphqlOperation(listFoodItems))
}
