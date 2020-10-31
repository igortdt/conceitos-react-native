import React, {useState, useEffect} from "react";


import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import faker from 'faker';

import api from './services/api';

export default function App() {
  
  const [repositories, setRepositories] = useState([]);


  useEffect(() => {
      api.get('repositories').then(response => {
          console.log(response.data);
        setRepositories(response.data);
      })
  }, []);
  
  
  async function handleAddRepository() {
      
      const nameRepository = faker.commerce.product();
      const nameTech1 = faker.commerce.product();
      const nameTech2 = faker.commerce.product();

      const response = await api.post('repositories',
          {
              title : `Repository ${nameRepository}`,
              url : `http://${nameRepository}.com`,
              techs : `${nameTech1}, ${nameTech2}`,
          }
      );

      const repository = response.data;
      setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
      
      await api.delete(`repositories/${id}`);
      
      setRepositories(repositories.filter((repository) => repository.id !== id));
      
  }


  async function handleLikeRepository(id) {
      
    try { 
        const {data : repositoryUpdate} = await api.post(`repositories/${id}/like`);
        
            
        setRepositories(
            repositories.map((repository) =>
              repository.id === id ? repositoryUpdate : repository
            )
          );
    } catch (error) {
        console.log(error);
    }
    
      
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>

      <FlatList                    
        data={repositories}
        keyExtractor={repository  => repository.id}
        renderItem={({item: repository }) => (
          <View style={styles.repositoryContainer}>
            <Text style={styles.repository}>{repository.title}</Text>

            <View style={styles.techsContainer}>
              <Text style={styles.tech}>
                {repository.techs}
              </Text>
             
            </View>

            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes} likes
              </Text>
            </View>

            <View style={styles.viewHorizantal}>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
                >
                <Text style={styles.buttonText}>Like</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonRemove}
                onPress={() => handleRemoveRepository(repository.id)}
                >
                <Text>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>

        )}
        />

          <TouchableOpacity activeOpacity={0.6} style={styles.buttonAdd} onPress={handleAddRepository}>
               <Text>Add Repository</Text>
          </TouchableOpacity>

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },


  buttonAdd: {
    backgroundColor: "#FFE607",
    margin: 20,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonRemove: {
      marginTop: 10,
      backgroundColor: "#FF0808",      
      padding: 15,
  },

  viewHorizantal: {
    flex: 1,
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 5
}

});
