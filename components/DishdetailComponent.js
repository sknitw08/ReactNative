import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';

import { Card, Icon, Rating, Input } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import { postFavorite, postComment } from '../redux/ActionCreators';

function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}
            >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name= 'pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.toggleCommentModal()}
                    />
                </View>
            </Card>
        );
    } else {
        return(<View></View>)
    }
}

const RenderComments = (props) => {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating startingValue={item.rating} readonly imageSize={10}
                        style={{ display: 'flex', flex: 1, flexDirection: 'row',
                                justifyContent: 'flex-start', padding: 5}} 
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
          showCommentModal: false,
          rating: 5,
          author: '',
          comment: ''
        }
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite = (dishId) => {
        this.props.postFavorite(dishId);
    }

    resetCommentModal = () => {
        this.setState({
            rating: 5,
            author: '',
            comment: ''
        })
    }

    toggleCommentModal = () => {
        this.setState({ showCommentModal: !this.state.showCommentModal });
    }

    ratingCompleted = (rating) => {
        this.setState({
          'rating': rating
        });
    }

    submitComment = (dishId) => {
        console.log('Submitting ');
        this.toggleCommentModal();
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.resetCommentModal();
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                            favorite={this.props.favorites.some(el => el === dishId)}
                            onPress={() => this.markFavorite(dishId)} 
                            toggleCommentModal = {this.toggleCommentModal} />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                        visible = {this.state.showCommentModal}
                        onRequestClose = {() => this.toggleCommentModal()}
                        onDismiss = {() => this.toggleCommentModal()} >
                    <View style={styles.modal}>
                        <Rating showRating ratingCount={5}
                                style={{ paddingVertical: 10 }}
                                startingValue={this.state.rating}
                                onFinishRating={this.ratingCompleted}
                        />
                        <Input placeholder='Author'
                                value={this.state.author}
                                onChangeText={(text) => this.setState({author: text})}
                                leftIcon={
                                    <Icon name='user-o' type='font-awesome' size={24}
                                            color='black' containerStyle={{margin: 10}} />
                                }
                        />
                        <Input placeholder='Comment'
                                value={this.state.comment}
                                onChangeText={(text) => this.setState({comment: text})}
                                leftIcon={
                                    <Icon name='comment-o' type='font-awesome' size={24}
                                        color='black' containerStyle={{margin: 10}} />
                                }
                        />
                        <Button onPress={() => { this.submitComment(dishId); } }
                                color='#512DA8' raised title='Submit' />
                        <View style={{marginTop: 20}}></View>
                        <Button color='grey' onPress={() => { this.toggleCommentModal(); } } title='Cancel' />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);