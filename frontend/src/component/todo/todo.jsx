import React, { useEffect, useState } from "react";
import "./todo.css"; // Import CSS for styling
import axios from "axios"; // Import Axios for making HTTP requests
import { API_BASE_URL } from "../../config"; // Import base URL for API requests

const Todo = () => {
   // State for managing 
   const [mode, setMode] = useState({ type: "add", id: null });
   const [data, setData] = useState([]);
   const [item, setItem] = useState("");

   // Handle changes in the input field
   const handleOnChange = (e) => {
      setItem(e.target.value);
   };

   // Handle form submission for adding or updating items
   const onSubmit = async () => {
      const requestData = { item }; // Prepare request data

      try {
         if (mode.type === "add") {
            // Adding a new item
            const response = await axios.post(
               `${API_BASE_URL}/data`,
               requestData
            );
            setData([...data, response.data.data]); // Update state with the new item
         } else {
            // Editing an existing item
            const response = await axios.put(
               `${API_BASE_URL}/edit/${mode.id}`,
               requestData
            );
            setData(
               data.map((item) =>
                  item._id === response.data.item._id
                     ? response.data.item
                     : item
               )
            ); // Update state with the edited item
            setMode({ type: "add", id: null }); // Reset mode to add new item
         }
         setItem(""); // Clear input field
      } catch (e) {
         console.error("Error in item submission", e); 
      }
   };

   // Fetch all todo Data from the API
   const getAllData = async () => {
      try {
         const response = await axios.get(`${API_BASE_URL}/getdata`);
         if (response.status === 200) {
            setData(response.data); // Update state with fetched items
         }
      } catch (error) {
         console.error("Error fetching items: ", error); 
      }
   };

   // Delete an item by ID
   const deleteItem = async (id) => {
      try {
         await axios.delete(`${API_BASE_URL}/deleteitem/${id}`);
         getAllData(); // Refresh the list of items after deletion
      } catch (e) {
         console.log("Error deleting item:", e);
      }
   };

   // Set mode to edit and populate the input field with the current item
   const editItem = (id, item) => {
      setItem(item);
      setMode({ type: "edit", id });
   };

   // Toggle the completion status of an item
   const toggleComplete = async (id, completed) => {
      try {
         const response = await axios.put(
            `${API_BASE_URL}/complete/${id}`,
            { completed: !completed } // Toggle the completed status
         );
         setData(
            data.map((item) =>
               item._id === response.data.item._id
                  ? response.data.item
                  : item
            )
         ); // Update state with the toggled item
      } catch (e) {
         console.log("Error marking item as complete:", e); 
      }
   };

   // Handle Enter key press for form submission
   const handleKeyPress = (event) => {
      if (event.key === "Enter") {
         onSubmit();
      }
   };

   // Fetch all todo items when the component mounts
   useEffect(() => {
      getAllData();
   }, []);

   return (
      <div className="container main">
         <div className="row">
            <div className="col-12 hero">
               <div className="col-12 todo-text">Todo App</div>
               <input
                  className="formControl Input"
                  type="text"
                  placeholder="Enter your task"
                  value={item}
                  onChange={handleOnChange}
                  onKeyPress={handleKeyPress}
               />
               <button
                  className="addButton"
                  onClick={onSubmit}
                  type="submit"
               >
                  {mode.type === "add" ? "Add" : "Edit"}
               </button>

               <div className="col-12 mt-5">
                  {data.length > 0 ? data.map((list) => (
                     <div className="list-item" key={list._id}>
                        <div className="lists">
                           <div className="d-flex align-items-center">
                              <input 
                              className="mx-2"
                                 type="checkbox" 
                                 checked={list.completed} 
                                 onChange={() => toggleComplete(list._id, list.completed)} 
                              />
                              
                              <div className="item" style={{ textDecoration: list.completed ? 'line-through' : 'none' }}>
                                 {list.item}
                              </div>

                              <div className="mx-2 mx-md-3 mx-lg-5 time">
                                 {new Date(list.createdAt).toLocaleString()}
                              </div>
                           </div>
                        
                        <div>
                         <div className="d-flex"> 
                           <button
                              className="butt but-delete"
                              onClick={() => deleteItem(list._id)}
                           >
                              Delete
                           </button>
                           <button
                              className="butt but-edit"
                              onClick={() => editItem(list._id, list.item)}
                           >
                              Edit
                           </button>
                        </div>
                        </div>
                        </div>
                     </div>
                  )) : "No items found"}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Todo;
