import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Text } from 'evergreen-typography'
import TableHeaderCell from './TableHeaderCell'
import SortableIcon from './SortableIcon'

export default class TextTableHeaderCell extends PureComponent {
  static propTypes = {
    ...TableHeaderCell.propTypes,
    ...SortableIcon.propTypes,
    textProps: PropTypes.objectOf(Text.propTypes),
    isSortable: PropTypes.bool,
  }

  static defaultProps = {
    ...SortableIcon.defaultProps,
  }

  render() {
    const { children, textProps, isSortable, sortOrder, ...props } = this.props
    return (
      <TableHeaderCell
        {...(isSortable ? { cursor: 'pointer' } : {})}
        {...props}
      >
        <Text fontWeight={500} size={300} flex="1" {...textProps}>
          {children}{' '}
        </Text>
        {isSortable && <SortableIcon sortOrder={sortOrder} />}
      </TableHeaderCell>
    )
  }
}
