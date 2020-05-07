import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.payload]
      };
    case UPDATE_CONTACT:
      return {
        ...state,
        // Map contacts to a new array
        contacts: state.contacts.map((contact) => {
          // If a contact has the same id as the updated contact,
          // insert the updated contact, otherwise insert the existing contact
          return contact.id !== action.payload.id ? contact : action.payload;
        })
      };
    case DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter(
          // remove contacts without the id specified the payload
          (contact) => contact.id !== action.payload
        )
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      };
    default:
      return state;
  }
};
