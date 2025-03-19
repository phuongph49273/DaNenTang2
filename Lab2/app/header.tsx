import { Image, StyleSheet, Text, View } from 'react-native';
import React, { FC, memo } from 'react';

type HeaderType = {
    name: string;
    avatar: string;
};

const Header: FC<HeaderType> = memo(({ name, avatar }) => {
    console.log('re-render header');
    return (
        <View style={styles.container}>
            <Image
                resizeMode="center"
                style={styles.avatar}
                source={{ uri: avatar }}
            />
            <View>
                <Text style={styles.greeting}>Chào ngày mới</Text>
                <Text style={styles.name}>{name}</Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    greeting: {
        fontSize: 14,
        color: '#666',
    },
});

export default Header;