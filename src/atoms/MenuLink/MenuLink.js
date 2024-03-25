import { Link } from 'gatsby'
import './MenuLink.scss'

function MenuLink(props) {
  const mod_class = ['MenuLink', props.theme !== undefined ? 'theme-' + props.theme : ''].join('')

  return (
    <Link className={mod_class} to={props.to} activeClassName='is-active'>
      {props.label}
    </Link>
  )
}

MenuLink.propTypes = {}

export default MenuLink
