import React, {Component, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

const App = () => {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  let limit = 25;

  const getData = () => {
    let query = `?skip=${skip}&limit=${limit}`;
    fetch('https://dummyjson.com/products' + query)
      .then(res => res.json())
      .then(res => {
        if (res.products.length == 0) {
          setLoadMore(false);
        }
        setData([...data, ...res.products]);
        setSkip(skip + 25);
        setShowLoader(false);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const onEndReached = () => {
    if (loadMore) {
      setShowLoader(true);
      getData();
    }
  };

  const renderItem = useCallback(
    ({item}) => {
      return (
        <View style={styles.listCon}>
          <Image source={{uri: item.thumbnail}} style={styles.image} />
          <View style={styles.namePriceCon}>
            <Text>{item.brand}</Text>
            <Text>{item.price}</Text>
          </View>
          <Text>{item.description}</Text>
        </View>
      );
    },
    [data],
  );

  const keyExtractor = useCallback(item => `${item.id}`);

  const ItemSeparatorComponent = useCallback(() => {
    return <View style={{height: 20}} />;
  }, [data]);

  const footerCom = useCallback(() => {
    return <ActivityIndicator size={'large'} />;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        onEndReached={onEndReached}
        ListFooterComponent={showLoader && footerCom}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  listCon: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
  },
  image: {width: '100%', height: 200, borderRadius: 10},
  namePriceCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default App;
