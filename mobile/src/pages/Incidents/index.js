import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import { View, FlatList ,Image,Text,TouchableOpacity } from 'react-native';

import api from '../../services/api'

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Incident(){
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetail(incident) {
        navigation.navigate('Detail', { incident });
    }


    async function loadIncidents() {
        if(loading){
            return;
        }

        if(total > 0 && incidents.length === total){
            return;
        }

        setLoading(true);

        try {
        const response = await api.get('', {params: { page }});
        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        }catch(err){
            setIncidents([{
                "id": 404,
                "title": "erro",
                "description": "erro",
                "value": 404,
                "ong_id": "erro",
                "name": "erro",
                "email": "erro",
                "whatsapp": "5581999487583",
                "city": "erro",
                "uf": "erro"
              },{
                "id": 410,
                "title": "erro",
                "description": "erro",
                "value": 404,
                "ong_id": "erro",
                "name": "erro",
                "email": "erro",
                "whatsapp": "5581999487583",
                "city": "erro",
                "uf": "erro"
              }])

            setTotal(2)
        }
        setLoading(false);
    }

    useEffect(() => {
        loadIncidents();
    },[]);

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList
                style={styles.incidentList}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem= {({ item: incident }) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>
                            {Intl.NumberFormat('pt-BR', 
                            {style: 'currency',
                            currency: 'BRL'}).format(incident.value)}
                            </Text>

                        <TouchableOpacity style={styles.detailButton} 
                        onPress={() => navigateToDetail(incident)} >
                            <Text style={styles.detailButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041" />
                        </TouchableOpacity>
                </View>
                )}
            />
        </View>
    );
}