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

        renderRow: PropTypes.func.isRequired,
        onPress: PropTypes.func,
    };

    static defaultProps = {
        index: 0,
        horizontal: true,
        loop: true,
        ratio: 0.867
    };

    constructor(props) {
        super(props);

        const { dataSource, width, height, horizontal, index, loop, ratio } = this.props;

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
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource, width, height, horizontal, index, loop, ratio } = nextProps;
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
    }


    /**
    | -------------------------------------------------------
    | public api
    | -------------------------------------------------------
    */
    scrollTo(index, animated = false) {
        this.scrollView.scrollTo({ [this.ezswiper.scrollToDirection]: this.ezswiper.side * index, animated: animated });
    }

    /**
    | -------------------------------------------------------
    | private api
    | -------------------------------------------------------
    */
    updateAnimated(currentPageFloat, currentIndex) {
        const { scaleArray, translateArray } = this.state;
        const translate = this.ezswiper.side * (1 - this.ezswiper.ratio) / 2 * 1.5
        for (let i = 0; i < this.ezswiper.count + 2; i++) {
            if (i === currentIndex) {
                scaleArray[i].setValue(1 - Math.abs(currentPageFloat - currentIndex) * (1 - this.ezswiper.ratio));
                translateArray[i].setValue(translate * (currentPageFloat - currentIndex));
            } else if (i === currentIndex - 1 || i === currentIndex + 1) {
                scaleArray[i].setValue(this.ezswiper.ratio + Math.abs(currentPageFloat - currentIndex) * (1 - this.ezswiper.ratio));
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
            const oldIndex = this.ezswiper.currentIndex
            const currentPageFloat = offset / this.ezswiper.side;
            this.ezswiper.currentIndex = ((currentPageFloat % 1) === 0) ? currentPageFloat : this.ezswiper.currentIndex
            if (oldIndex !== this.ezswiper.currentIndex){
                this.onDidChange()
            }
            this.updateAnimated(currentPageFloat, this.ezswiper.currentIndex);
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
                        <Animated.View style={{ backgroundColor: 'transparent', width: this.ezswiper.horizontal ? this.ezswiper.cardSide : width, height: this.ezswiper.horizontal ? height : this.ezswiper.cardSide, transform: [{ [this.ezswiper.horizontal ? 'scaleY' : 'scaleX']: scaleArray[i] }, { [this.ezswiper.horizontal ? 'translateX' : 'translateX']: translateArray[i] }] }}>
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
