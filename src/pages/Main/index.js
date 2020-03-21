import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import { Container, Form, Input, SubmitButton } from './styles';

export default class Main extends Component {
    state = {
        newUser: '',
        users: [],
    };

    handleAddUser = async () => {
        const { users, newUser } = this.state;
        console.tron.log('antes do response');
        const response = await api.get(`https://api.github.com/users/zanolera`);
        // const response = await api.get(`/users/${newUser}`);
        console.tron.log('depois do response');
        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        };

        this.setState({
            users: [...users, data],
            newUser: '',
        });
    };

    render() {
        const { users, newUser } = this.state;
        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCampitalize="none"
                        placeholder="Adicionar usuário"
                        value={newUser}
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                    />
                    <SubmitButton onPress={this.handleAddUser}>
                        <Icon name="add" size={20} color="#FFF" />
                    </SubmitButton>
                </Form>
            </Container>
        );
    }
}

Main.navigationOptions = {
    title: 'Usuários',
};
