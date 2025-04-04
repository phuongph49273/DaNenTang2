import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLazyGetPokemonByNameQuery } from '../pokemon';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Define type for Pokemon types
interface PokemonType {
  type: {
    name: string;
  };
}

const PokemonSearch = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [getPokemon, { data, error, isLoading }] = useLazyGetPokemonByNameQuery();

  const handleSearch = () => {
    if (pokemonName.trim()) {
      getPokemon(pokemonName);
    }
  };

  // Helper function to get error message
  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined) => {
    if (!error) return 'Unknown error occurred';
    
    // Handle FetchBaseQueryError
    if ('status' in error) {
      return `Error ${error.status}: ${
        typeof error.data === 'string' 
          ? error.data 
          : JSON.stringify(error.data)
      }`;
    }
    
    // Handle SerializedError
    return error.message || 'Unknown error occurred';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokemon Search</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Pokemon name"
          value={pokemonName}
          onChangeText={setPokemonName}
        />
        <Button title="Tìm kiếm" onPress={handleSearch} />
      </View>
      
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {getErrorMessage(error)}
          </Text>
        </View>
      )}
      
      {data && (
        <View style={styles.resultContainer}>
          <Text style={styles.pokemonName}>{data.name.toUpperCase()}</Text>
          <Image
            style={styles.pokemonImage}
            source={{ uri: data.sprites.front_default }}
          />
          <View style={styles.detailsContainer}>
            <Text>Height: {data.height / 10}m</Text>
            <Text>Weight: {data.weight / 10}kg</Text>
            <Text>Base Experience: {data.base_experience}</Text>
            <Text>Types: {data.types.map((typeObj: PokemonType) => typeObj.type.name).join(', ')}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  detailsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default PokemonSearch;