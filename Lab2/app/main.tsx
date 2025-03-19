import { StyleSheet, Text, View } from 'react-native'
import React, { Component, useCallback, useEffect, useState } from 'react'
import Header  from './header'
import  Body  from './body'
import  Footer  from './footer'


const colors = ['white', 'gray', 'yellow', 'red', 'blue', 'orange'];
export type UserType = {
    name: string,
    avatar: string,
}
export default function Main()  {
    const [user, setUser] = useState<UserType>({
        name: 'Chưa có tên',
        avatar: 'https://static.thenounproject.com/png/363640-200.png'
    });
    const [lastTimeUpdate,setLastTimeUpdate] = useState(
        'Bạn chưa cập nhật thông tin'
    )
    const [footerColor,setFooterColor] = useState(colors[0]);

    const handleUpdateInfor = useCallback((_user: UserType) => {
        setUser(_user);
    }, [])

    const handleRandomColor = useCallback(() => {
        const numberRan: number = Math.floor(Math.random() * colors.length); 
        setFooterColor(colors[numberRan]); 
    }, [colors]);

    useEffect(()=>{
        const currentdate = new Date()
        const datetime = 
            currentdate.getDate() +
            '/' +
            currentdate.getMonth() +
            '/' +
            currentdate.getFullYear() +
            ' ' +
            currentdate.getHours() +
            ':' +
            currentdate.getMinutes() +
            ':' +
            currentdate.getSeconds();
        setLastTimeUpdate(datetime);
    }, [user])
    return (
      <View style={styles.container}>
        <Header name={user.name} avatar={user.avatar} />
        <Body
            onUpdateInfor={handleUpdateInfor}
            onClickChangeBgFooter = {handleRandomColor}
        />
        <Footer timeUpdate={lastTimeUpdate} backgroundColor={footerColor}/>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: 50
    }
})