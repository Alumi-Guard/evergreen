import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import fuzzaldrin from 'fuzzaldrin-plus'
import Downshift from 'downshift'
import VirtualList from 'react-tiny-virtual-list'
import AutocompleteItem from './AutocompleteItem'
import { Pane } from 'evergreen-layers'
import { Text } from 'evergreen-typography'
import { Popover } from 'evergreen-popover'

const fuzzyFilter = (items, input) => fuzzaldrin.filter(items, input)

const autocompleteItemRenderer = props => <AutocompleteItem {...props} />

export default class Autocomplete extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    itemSize: PropTypes.number,
    renderItem: PropTypes.func,
    itemsFilter: PropTypes.func,
    popoverMaxHeight: PropTypes.number,
    useSmartPositioning: PropTypes.bool,
    ...Downshift.propTypes,
  }

  static defaultProps = {
    itemsFilter: fuzzyFilter,
    useSmartPositioning: false,
    itemSize: 32,
    popoverMaxHeight: 240,
    renderItem: autocompleteItemRenderer,
  }

  renderResults = ({
    width,
    inputValue,
    highlightedIndex,
    selectedItem,
    getItemProps,
  }) => {
    const {
      itemsFilter,
      itemSize,
      items: originalItems,
      popoverMaxHeight,
      renderItem,
    } = this.props
    const items =
      inputValue.trim() === ''
        ? originalItems
        : itemsFilter(originalItems, inputValue)

    return (
      <Pane width={width}>
        {items.length > 0 && (
          <VirtualList
            width="100%"
            scrollToIndex={highlightedIndex || 0}
            scrollToAlignment="auto"
            height={Math.min(items.length * itemSize, popoverMaxHeight)}
            itemCount={items.length}
            itemSize={itemSize}
            overscanCount={3}
            renderItem={({ index, style }) => {
              const item = items[index]
              return renderItem(
                getItemProps({
                  item,
                  key: item,
                  index,
                  style,
                  isHighlighted: highlightedIndex === index,
                  isEven: index % 2 === 1,
                  isSelected: selectedItem === item,
                  children: item,
                }),
              )
            }}
          />
        )}
      </Pane>
    )
  }

  render() {
    const {
      children,
      itemSize,
      renderItem,
      itemsFilter,
      popoverMaxHeight,
      useSmartPositioning,
      ...props
    } = this.props

    return (
      <Downshift {...props}>
        {({
          isOpen,
          inputValue,
          getItemProps,
          selectedItem,
          highlightedIndex,
          ...downshiftProps
        }) => (
          <div>
            <Popover
              useSmartPositioning={useSmartPositioning}
              content={({ targetRect }) =>
                this.renderResults({
                  width: targetRect.width,
                  inputValue,
                  getItemProps,
                  selectedItem,
                  highlightedIndex,
                })}
              display="inline-block"
              isOpen={isOpen}
            >
              {({ isOpen: isOpenPopover, toggle, getRef, key }) =>
                children({
                  key,
                  isOpen: isOpenPopover,
                  toggle,
                  getRef,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                  ...downshiftProps,
                })}
            </Popover>
          </div>
        )}
      </Downshift>
    )
  }
}
