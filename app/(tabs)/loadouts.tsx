
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { useBungieToken } from '../context/BungieTokenContext';


type Item = {
  itemInstanceId: string;
  itemHash: string;
  name: string;
  icon: string;
  type: string;
};

type Character = {
  characterId: string;
  className: string;
  raceName: string;
  genderName: string;
  light: number;
  emblem: string;
};


export default function Loadouts() {
  const { accessToken } = useBungieToken();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [loadingCharacters, setLoadingCharacters] = useState(false);


  // Obtiene los personajes del usuario
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!accessToken) return;
      setLoadingCharacters(true);
      setError(null);
      try {
        // 1. Obtener membershipId y membershipType
        const profileRes = await fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const profileData = await profileRes.json();
        const destinyMembership = profileData.Response?.destinyMemberships?.[0];
        if (!destinyMembership) throw new Error('No se encontró perfil de Destiny.');
        const { membershipId, membershipType } = destinyMembership;

        // 2. Obtener personajes
        const charsRes = await fetch(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-API-Key': '37130',
          },
        });
        const charsData = await charsRes.json();
        const charList: Character[] = Object.entries(charsData.Response.characters.data).map(
          ([characterId, data]: [string, any]) => ({
            characterId,
            className: data.classType === 0 ? 'Titán' : data.classType === 1 ? 'Cazador' : 'Hechicero',
            raceName: data.raceType === 0 ? 'Humano' : data.raceType === 1 ? 'Despierto' : 'Exo',
            genderName: data.genderType === 0 ? 'Masculino' : 'Femenino',
            light: data.light,
            emblem: data.emblemPath ? 'https://www.bungie.net' + data.emblemPath : '',
          })
        );
        setCharacters(charList);
      } catch (err: any) {
        setError('Error al obtener personajes: ' + (err.message || err));
      } finally {
        setLoadingCharacters(false);
      }
    };
    fetchCharacters();
  }, [accessToken]);

  // Obtiene el inventario del personaje seleccionado
  useEffect(() => {
    const fetchInventory = async () => {
      if (!accessToken || !selectedCharacter) return;
      setLoadingInventory(true);
      setError(null);
      try {
        // 1. Obtener membershipId y membershipType
        const profileRes = await fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-API-Key': '37130',
          },
        });
        const profileData = await profileRes.json();
        const destinyMembership = profileData.Response?.destinyMemberships?.[0];
        if (!destinyMembership) throw new Error('No se encontró perfil de Destiny.');
        const { membershipId, membershipType } = destinyMembership;

        // 2. Obtener inventario del personaje seleccionado
        const invRes = await fetch(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/Character/${selectedCharacter}/?components=201`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-API-Key': '37130',
          },
        });
        const invData = await invRes.json();
        const items = invData.Response.inventory.data.items;

        // 3. Obtener información de los items (hashes)
        const manifestRes = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest/', {
          headers: { 'X-API-Key': '37130' },
        });
        const manifest = await manifestRes.json();
        const itemDefsUrl = 'https://www.bungie.net' + manifest.Response.jsonWorldComponentContentPaths['es']['DestinyInventoryItemDefinition'];
        const defsRes = await fetch(itemDefsUrl);
        const itemDefs = await defsRes.json();

        const filtered: Item[] = items
          .map((item: any) => {
            const def = itemDefs[item.itemHash];
            if (!def) return null;
            const type = def.itemType;
            if (type !== 2 && type !== 3) return null;
            return {
              itemInstanceId: item.itemInstanceId,
              itemHash: item.itemHash,
              name: def.displayProperties?.name || 'Desconocido',
              icon: def.displayProperties?.icon ? 'https://www.bungie.net' + def.displayProperties.icon : '',
              type: type === 2 ? 'Arma' : 'Armadura',
            };
          })
          .filter(Boolean);
        setInventory(filtered);
      } catch (err: any) {
        setError('Error al obtener inventario: ' + (err.message || err));
      } finally {
        setLoadingInventory(false);
      }
    };
    fetchInventory();
  }, [accessToken, selectedCharacter]);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: '#191A1C',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#23272A',
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
      width: '100%',
    },
    itemRowSelected: {
      borderColor: '#F8E16C',
      borderWidth: 2,
    },
    itemIcon: {
      width: 48,
      height: 48,
      borderRadius: 6,
      marginRight: 12,
      backgroundColor: '#333',
    },
    itemName: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemType: {
      color: '#aaa',
      fontSize: 13,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#F8E16C',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
      width: '100%',
      maxWidth: 400,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 25,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: '#ff6b6b',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
    resultBox: {
      backgroundColor: '#23272A',
      borderRadius: 10,
      padding: 16,
      marginTop: 20,
      alignItems: 'center',
      width: '100%',
      maxWidth: 400,
    },
    resultTitle: {
      color: '#F8E16C',
      fontWeight: 'bold',
      marginBottom: 8,
      fontSize: 16,
    },
    resultText: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
    },
  });

  const toggleSelect = (itemInstanceId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemInstanceId)
        ? prev.filter((id) => id !== itemInstanceId)
        : [...prev, itemInstanceId]
    );
  };

  const handleCreateLoadout = async () => {
    if (!accessToken) {
      setError('No hay access token de Bungie. Autentícate primero en la pestaña Bungie.');
      return;
    }
    if (selectedItems.length === 0) {
      setError('Selecciona al menos un arma o armadura.');
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      // Construir el cuerpo de la petición
      const body = {
        name,
        description,
        items: selectedItems,
        // Puedes agregar más campos según la API de Bungie
      };
      const res = await fetch('https://www.bungie.net/Platform/Destiny2/Actions/Loadouts/CreateLoadout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-API-Key': '37130',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Loadout en Destiny 2</Text>
      <Text style={{ color: '#aaa', marginBottom: 10 }}>
        Access Token: {accessToken ? '✔️' : '❌ No autenticado'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Loadout"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={{ color: '#F8E16C', fontWeight: 'bold', marginTop: 20, marginBottom: 10, fontSize: 16 }}>Selecciona un personaje:</Text>
      {loadingCharacters && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />}
      {!loadingCharacters && characters.length === 0 && (
        <Text style={{ color: '#aaa', marginBottom: 10 }}>No se encontraron personajes. Revisa tu cuenta de Destiny 2.</Text>
      )}
      {!loadingCharacters && characters.length > 0 && (
        <FlatList
          data={characters}
          keyExtractor={item => item.characterId}
          horizontal
          style={{ marginBottom: 20, width: '100%' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: selectedCharacter === item.characterId ? '#F8E16C' : '#ccc',
                borderRadius: 10,
                padding: 10,
                marginRight: 10,
                alignItems: 'center',
                backgroundColor: '#23272A',
                minWidth: 120,
              }}
              onPress={() => setSelectedCharacter(item.characterId)}
            >
              {item.emblem ? (
                <Image source={{ uri: item.emblem }} style={{ width: 60, height: 60, borderRadius: 8, marginBottom: 6 }} />
              ) : null}
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.className}</Text>
              <Text style={{ color: '#aaa', fontSize: 12 }}>{item.raceName} / {item.genderName}</Text>
              <Text style={{ color: '#F8E16C', fontSize: 12 }}>Luz: {item.light}</Text>
              {selectedCharacter === item.characterId && <Text style={{ color: '#F8E16C', fontSize: 12 }}>Seleccionado</Text>}
            </TouchableOpacity>
          )}
        />
      )}

      {selectedCharacter && (
        <>
          <Text style={{ color: '#F8E16C', fontWeight: 'bold', marginTop: 10, marginBottom: 10, fontSize: 16 }}>Selecciona armas y armaduras:</Text>
          {loadingInventory && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />}
          {!loadingInventory && inventory.length === 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: '#aaa' }}>No se encontraron armas ni armaduras para este personaje.</Text>
            </View>
          )}
          <FlatList
            data={inventory}
            keyExtractor={item => item.itemInstanceId}
            style={{ width: '100%' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.itemRow,
                  selectedItems.includes(item.itemInstanceId) && styles.itemRowSelected
                ]}
                onPress={() => toggleSelect(item.itemInstanceId)}
              >
                <Image source={{ uri: item.icon }} style={styles.itemIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemType}>{item.type}</Text>
                </View>
                <Text style={{ fontSize: 22 }}>{selectedItems.includes(item.itemInstanceId) ? '✅' : '⬜️'}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
      <Pressable style={styles.button} onPress={handleCreateLoadout} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creando...' : 'Crear Loadout'}</Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {response && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Respuesta:</Text>
          <Text selectable style={styles.resultText}>{JSON.stringify(response, null, 2)}</Text>
        </View>
      )}

    </ScrollView>
  );

}
