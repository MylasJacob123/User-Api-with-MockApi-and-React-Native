import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch(`https://67441fc2b4e2e04abea0e545.mockapi.io/Users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        showToast("Error fetching users", "error"); 
      });
  }, []);

  const showToast = (message, type) => {
    Toast.show({
      type: type,
      position: "top",
      text1: message,
      visibilityTime: 3000, 
    });
  };

  const addUser = () => {
    if (!newUser.trim()) {
      showToast("User name cannot be empty.", "error"); 
      return;
    }

    fetch(`https://67441fc2b4e2e04abea0e545.mockapi.io/Users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newUser }),
    })
      .then((res) => res.json())
      .then((newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setNewUser("");
        showToast("User added successfully", "success"); 
      })
      .catch((err) => {
        console.error("Error adding user:", err);
        showToast("Error adding user", "error"); 
      });
  };

  const deleteUser = (id) => {
    fetch(`https://67441fc2b4e2e04abea0e545.mockapi.io/Users/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        showToast("User deleted successfully", "success"); 
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        showToast("Error deleting user", "error");
      });
  };

  const editUser = (id) => {
    fetch(`https://67441fc2b4e2e04abea0e545.mockapi.io/Users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editUserName }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? updatedUser : user))
        );
        setUserId(null);
        setEditUserName("");
        showToast("User updated successfully", "success"); 
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        showToast("Error updating user", "error"); 
      });
      alert(`Updated user with ID: ${id}`);
  };

  const startEditing = (id, currentName) => {
    setUserId(id);
    setEditUserName(currentName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addNewUserContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter user name"
          value={newUser}
          onChangeText={(text) => setNewUser(text)}
        />
        <TouchableOpacity onPress={addUser} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                {userId === item.id ? (
                  <TextInput
                    style={styles.secondInput}
                    value={editUserName}
                    onChangeText={(text) => setEditUserName(text)}
                  />
                ) : (
                  <Text style={styles.name}>{item.name}</Text>
                )}
                <Text style={styles.date}>
                  Joined: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.userActionButtons}>
                {userId === item.id ? (
                  <TouchableOpacity
                    onPress={() => editUser(item.id)}
                    style={styles.iconButton}
                  >
                    <FontAwesome name="check" size={24} color="#4CAF50" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => startEditing(item.id, item.name)}
                    style={styles.iconButton}
                  >
                    <FontAwesome name="pencil" size={24} color="#babab8" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteUser(item.id)}
                  style={styles.iconButton}
                >
                  <FontAwesome name="trash" size={24} color="#616161" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>Loading users...</Text>
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  addNewUserContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
    marginRight: 8,
    paddingVertical: 4,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  userActionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  secondInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
    paddingVertical: 2,
    color: "#333",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});
