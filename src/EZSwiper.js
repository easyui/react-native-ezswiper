/**
 * react-native-ezswiper
 * @author Zhu yangjun<zhuyangjun@gmail.com>
 * @url https://github.com/easyui/react-native-ezswiper
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TouchableOpacity,
    ScrollView,
    Animated,
    InteractionManager,
} from 'react-native'

export default class EZSwiper extends Component<{}> {
    /**
    | -------------------------------------------------------
    | EZSwiper component life
    | -------------------------------------------------------
    */
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        index: PropTypes.number,
        horizontal: PropTypes.bool,
        loop: PropTypes.bool,
        ratio: PropTypes.number,
        autoplayTimeout: PropTypes.number,
        autoplayDirection: PropTypes.bool,

        renderRow: PropTypes.func.isRequired,
        onPress: PropTypes.func,
        onWillChange: PropTypes.func,
        onDidChange: PropTypes.func,        
    };

    static defaultProps = {
        index: 0,
        horizontal: true,
        loop: true,
        ratio: 1,
        autoplayTimeout: 5,
        autoplayDirection: true,
    };

    constructor(props) {
        super(props);

        const { dataSource, width, height, horizontal, index, loop, ratio ,autoplayTimeout,autoplayDirection} = this.props;

        this.ezswiper = {
            horizontal: horizontal,
            scrollToDirection: horizontal ? 'x' : 'y',
            side: horizontal ? width : height,
            cardSide: (horizontal ? width : height) * ratio,
            dataSource: dataSource,
            count: dataSource.length,
            currentIndex: index,
            loop: loop,
            ratio: ratio,
            autoplayTimeout: autoplayTimeout,
            autoplayDirection: autoplayDirection,
        }

        const scaleArray = [];
        const translateArray = [];
        for (let i = 0; i < this.ezswiper.count + 2; i++) {
            scaleArray.push(new Animated.Value(1));
            translateArray.push(new Animated.Value(0));
        }
        this.state = { scaleArray, translateArray };


        this.events = {
            renderRow: this.renderRow.bind(this),
            onPress: this.onPress.bind(this),
            onWillChange: this.onWillChange.bind(this),
            onDidChange: this.onDidChange.bind(this),
        };

        this.refScrollView = this.refScrollView.bind(this)
        this.getRenderRowViews = this.getRenderRowViews.bind(this)
        this.updateAnimated = this.updateAnimated.bind(this)
        this.autoPlay = this.autoPlay.bind(this)      
        this.stopAutoPlay = this.stopAutoPlay.bind(this)                
        
    }

    componentWillUnmount() {
        this.stopAutoPlay()        
    }

    componentWillReceiveProps(nextProps) {
        this.stopAutoPlay()        
        const { dataSource, width, height, horizontal, index, loop, ratio ,autoplayTimeout,autoplayDirection} = this.props;
        this.ezswiper = {
            horizontal: horizontal,
            scrollToDirection: horizontal ? 'x' : 'y',
            side: horizontal ? width : height,
            cardSide: (horizontal ? width : height) * ratio,
            dataSource: dataSource,
            count: dataSource.length,
            currentIndex: index,
            loop: loop,
            ratio: ratio,
            autoplayTimeout: autoplayTimeout,
            autoplayDirection: autoplayDirection,
        }

        if (this.props.dataSource.length !== dataSource.length) {
            const scaleArray = [];
            const translateArray = [];
            for (let i = 0; i < this.ezswiper.count + 4; i++) {
                scaleArray.push(new Animated.Value(1));
                translateArray.push(new Animated.Value(0));
            }
            this.setState({ scaleArray, translateArray });
        }
    }

    componentDidMount() {
            this.scrollView.scrollTo({ [this.ezswiper.scrollToDirection]: (this.ezswiper.side * (this.ezswiper.loop ? this.ezswiper.currentIndex + 1 : this.ezswiper.currentIndex) || 1), animated: false });
            this.autoPlay()
    }


    /**
    | -------------------------------------------------------
    | public api
    | -------------------------------------------------------
    */
    scrollTo(index, animated = true) {
        this.scrollView.scrollTo({ [this.ezswiper.scrollToDirection]: this.ezswiper.side * index, animated: animated });
    }

    /**
    | -------------------------------------------------------
    | private api
    | -------------------------------------------------------
    */
    updateAnimated(currentPageFloat, scrollIndex) {
        const { scaleArray, translateArray } = this.state;
        const translate = this.ezswiper.side * (1 - this.ezswiper.ratio) / 2 * 1.7
        for (let i = 0; i < this.ezswiper.count + 2; i++) {
            if (i === scrollIndex) {
                scaleArray[i].setValue(1 - Math.abs(currentPageFloat - scrollIndex) * (1 - this.ezswiper.ratio));
                translateArray[i].setValue(translate * (currentPageFloat - scrollIndex));
            } else if (i === scrollIndex - 1 || i === scrollIndex + 1) {
                scaleArray[i].setValue(this.ezswiper.ratio + Math.abs(currentPageFloat - scrollIndex) * (1 - this.ezswiper.ratio));
                translateArray[i].setValue((currentPageFloat - i) * translate);
            } else {
                scaleArray[i].setValue(this.ezswiper.ratio);
                translateArray[i].setValue((currentPageFloat - i) * translate);
            }

        }
    }

    refScrollView(view) {
        this.scrollView = view;
    }

    autoPlay(){
       this.stopAutoPlay()
       if (!this.ezswiper.loop || !this.ezswiper.autoplayTimeout) {
           return
       } 

       this.autoPlayTimer  = setTimeout(() => {
        this.scrollTo(this.scrollIndex + (this.ezswiper.autoplayDirection ? 1 : -1))
      }, this.ezswiper.autoplayTimeout * 1000)
        
    }

    stopAutoPlay(){
        this.autoPlayTimer && clearTimeout(this.autoPlayTimer)        
    }

    /**
    | -------------------------------------------------------
    | EZSwiper events
    | -------------------------------------------------------
    */
    renderRow(obj, index) {
        if (typeof this.props.renderRow === 'function') {
            return this.props.renderRow(...arguments);
        }
    }

    onPress(obj, index) {
        if (typeof this.props.onPress === 'function') {
            return this.props.onPress(...arguments);
        }
    }

    onWillChange(obj, index) {
        if (typeof this.props.onWillChange === 'function') {
            return this.props.onWillChange(...arguments);
        }
    }

    onDidChange(obj, index) {        
        if (typeof this.props.onDidChange === 'function') {
            return this.props.onDidChange(...arguments);            
        }
    }
    /**
    | -------------------------------------------------------
    | ScrollView delegate
    | -------------------------------------------------------
    */
    onScroll(e) {
        if (this.scrollView) {
            this.stopAutoPlay()
            
            let offset = e.nativeEvent.contentOffset[this.ezswiper.scrollToDirection];

            if (this.ezswiper.loop) {
                if (Math.abs(offset - ((this.ezswiper.count + 1) * this.ezswiper.side)) < 0.1) {
                    offset = this.ezswiper.side
                    this.scrollView.scrollTo({ [this.ezswiper.scrollToDirection]: offset, animated: false });
                } else if (Math.abs(offset) < 0.1) {
                    offset = this.ezswiper.side * this.ezswiper.count
                    this.scrollView.scrollTo({ [this.ezswiper.scrollToDirection]: offset, animated: false });
                }
            }

            const currentPageFloat = offset / this.ezswiper.side;
            if ((currentPageFloat % 1) === 0) {
                this.willIndex = undefined                          
                this.scrollIndex = currentPageFloat 
                this.autoPlay()                
            }

           

            const willIndex =  Math.round(currentPageFloat);
            if ( this.willIndex === undefined && willIndex !==  this.scrollIndex){
                this.willIndex = willIndex
                const dataSourceIndex =  this.ezswiper.loop ? (this.willIndex + this.ezswiper.count - 1) % this.ezswiper.count : this.willIndex                
                this.onWillChange(this.ezswiper.dataSource[dataSourceIndex],dataSourceIndex)
            }

            const oldIndex = this.ezswiper.currentIndex            
            this.ezswiper.currentIndex = this.ezswiper.loop ? (this.scrollIndex  + this.ezswiper.count - 1) % this.ezswiper.count : this.scrollIndex 
            if (oldIndex !== this.ezswiper.currentIndex){      
                this.onDidChange(this.ezswiper.dataSource[this.ezswiper.currentIndex],this.ezswiper.currentIndex)
            }

            this.updateAnimated(currentPageFloat, this.scrollIndex );
        }
    }

    /**
    | -------------------------------------------------------
    | Render
    | -------------------------------------------------------
    */
    getRenderRowViews() {
        const { scaleArray, translateArray } = this.state;
        const { width, height } = this.props;

        const count = this.ezswiper.count + (this.ezswiper.loop ? 2 : 0);
        const margin = (this.ezswiper.side - this.ezswiper.cardSide) / 2;
        const views = [];
        const maxIndex = this.ezswiper.count - 1

        for (let i = 0; i < count; i++) {
            const dataSourceIndex = this.ezswiper.loop ? (i + maxIndex) % this.ezswiper.count : i
            const currentItem = this.ezswiper.dataSource[dataSourceIndex]
            views.push(
                <View key={i} style={{ flexDirection: this.ezswiper.horizontal ? 'row' : 'column' }}>
                    <View style={{ [this.ezswiper.horizontal ? 'width' : 'height']: margin, backgroundColor: 'transparent' }} />
                    <TouchableOpacity activeOpacity={1} onPress={() => this.events.onPress(currentItem, dataSourceIndex)}>
                        <Animated.View style={{ backgroundColor: 'transparent', width: this.ezswiper.horizontal ? this.ezswiper.cardSide : width, height: this.ezswiper.horizontal ? height : this.ezswiper.cardSide, transform: [{ [this.ezswiper.horizontal ? 'scaleY' : 'scaleX']: scaleArray[i] }, { [this.ezswiper.horizontal ? 'translateX' : 'translateY']: translateArray[i] }] }}>
                            {this.events.renderRow(currentItem, dataSourceIndex)}
                        </Animated.View>
                    </TouchableOpacity>
                    <View style={{ [this.ezswiper.horizontal ? 'width' : 'height']: margin, backgroundColor: 'transparent' }} />
                </View>
            );
        }
        return views;
    }

    render() {
        const { width, height } = this.props;
        return (
            <View style={[this.props.style, { overflow: 'hidden' }]}>
                <ScrollView
                    style={this.ezswiper.horizontal ? { backgroundColor: 'transparent' } : { position: 'absolute', height: this.ezswiper.side, width, top: (height - this.ezswiper.side) / 2, left: 0 }}
                    horizontal={this.ezswiper.horizontal}
                    pagingEnabled
                    ref={this.refScrollView}
                    onScroll={e => this.onScroll(e)}
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onLayout={event => {
                        // event.nativeEvent.layout.width
                    }}
                >
                    {this.getRenderRowViews()}
                </ScrollView>
            </View>
        );
    }
}
