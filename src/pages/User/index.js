import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: false,
        page: 1,
    };

    async componentDidMount() {
        this.load();
    }

    load = async (page = 1) => {
        const { stars } = this.state;
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        this.setState({ loading: true });

        const response = await api.get(`/users/${user.login}/starred`, {
            params: { page },
        });

        this.setState({
            stars: page >= 2 ? [...stars, ...response.data] : response.data,
            page,
            loading: false,
        });
    };

    loadMore = () => {
        const { page } = this.state;
        const nextPage = page + 1;

        this.load(nextPage);
    };

    refreshList = () => {
        this.setState({ stars: [], loading: true });
        this.load();
    };

    handleNavigate = repository => {
        const { navigation } = this.props;
        navigation.navigate('Repository', { repository });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;

        const user = navigation.getParam('user');
        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (
                    <ActivityIndicator color="#333" />
                ) : (
                    <Stars
                        onRefresh={this.refreshList}
                        refreshing={loading}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        renderItem={({ item }) => (
                            <Starred>
                                <OwnerAvatar
                                    source={{ uri: item.owner.avatar_url }}
                                />
                                <Info>
                                    <Title
                                        onPress={() =>
                                            this.handleNavigate(item)
                                        }
                                    >
                                        {item.name}
                                    </Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </Starred>
                        )}
                    />
                )}
            </Container>
        );
    }
}
