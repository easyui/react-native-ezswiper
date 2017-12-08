# react-native-ezswiper

[中文文档](./README_CN.md)

[![NPM version][npm-image]][npm-url]
[![release](https://img.shields.io/github/release/easyui/react-native-ezswiper.svg?style=flat-square)](https://github.com/easyui/react-native-ezswiper/releases)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/joeferraro/react-native-ezswiper/master/LICENSE.md)

source is simple, easy to use card swiper for React Native on iOS&android.


## Installation

```
$ npm install react-native-ezswiper --save
```

## Preview

![showios](showios.gif)  ![showandroid](showandroid.gif)


## Usage

import library：

```js
import EZSwiper from 'react-native-ezswiper';
```

### simple swiper

```js
<EZSwiper style={{width: width,height: 150,backgroundColor: 'white'}}
          dataSource={['0', '1' ,'2','3']}
          width={ width }
          height={150 }
          renderRow={this.renderRow}
          onPress={this.onPressRow}                      
          />
```

### card swiper

```js
<EZSwiper style={{width: width,height: 150,backgroundColor: 'white'}}
           dataSource={images}
           width={ width }
           height={150 }
           renderRow={this.renderImageRow}
           onPress={this.onPressRow} 
           ratio={0.867}                    
                    />
```

### advanced

```js
<EZSwiper style={{width: width,height: 150,backgroundColor: 'white'}}
                    dataSource={['0', '1' ,'2','3']}
                    width={ width }
                    height={150 }
                    renderRow={this.renderRow}
                    onPress={this.onPressRow} 
                    index={2}                
                    cardParams={{cardSide:width*0.867, cardSmallSide:150*0.867,cardSpace:width*(1-0.867)/2*0.2}}  
                    />
```

### vertical swiper

```js
<EZSwiper style={{width: width,height: 200,backgroundColor: 'white'}}
          dataSource={['0', '1' ,'2','3']}
          width={ width }
          height={200 }
          renderRow={this.renderRow}
          onPress={this.onPressRow} 
          ratio={0.867} 
          horizontal={false}  
                    />
```
## API

### Props

| key | type | default | description |                 
| --- | --- | --- | --- |
| width | PropTypes.number.isRequired |  | swiper width |
| height | PropTypes.number.isRequired |  | swiper height |
| index | PropTypes.number | 0 | initial index |
| horizontal | PropTypes.bool | true | swiper derection is horizontal |
| loop | PropTypes.bool | true | swiper is loop |
| autoplayTimeout | PropTypes.number | 5 |  auto play mode  (in second)|
| autoplayDirection | PropTypes.bool | true | cycle direction control |
| ratio | PropTypes.number | 1 | scaling ratio |
| cardParams | PropTypes.object | {} | swiper card advanced object |
| renderRow | PropTypes.func.isRequired | |  render card view |
| onPress | PropTypes.func | | card is clicked action |
| onWillChange | PropTypes.func | | next card will show | 
| onDidChange | PropTypes.func | | next card showed |
 
#### cardParams is object：`{cardSide,cardSmallSide,cardSpace}`
![cardParams](cardParams.png)

### Function
| function | description |                    
| --- | --- | 
| scrollTo(index, animated = true) | scroll to position |


## License
[MIT License](http://opensource.org/licenses/mit-license.html). © Zhu Yangjun 2017


[npm-image]: https://img.shields.io/npm/v/react-native-ezswiper.svg?style=flat-square
[npm-url]: https://npmjs.org/package/react-native-ezswiper
[travis-image]: https://img.shields.io/travis/yorkie/react-native-ezswiper.svg?style=flat-square
[travis-url]: https://travis-ci.org/yorkie/react-native-ezswiper
[david-image]: http://img.shields.io/david/yorkie/react-native-ezswiper.svg?style=flat-square
[david-url]: https://david-dm.org/yorkie/react-native-ezswiper
[downloads-image]: http://img.shields.io/npm/dm/react-native-ezswiper.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/react-native-ezswiper
[React Native]: https://github.com/facebook/react-native
[react-native-cn]: https://github.com/reactnativecn
[react-native-ezswiper]: https://github.com/easyui/react-native-ezswiper
[Linking Libraries iOS Guidance]: https://developer.apple.com/library/ios/recipes/xcode_help-project_editor/Articles/AddingaLibrarytoaTarget.html


