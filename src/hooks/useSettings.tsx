import { useContext } from 'react'
import { SettingsContext, SettingsContextValue } from 'contexts/SettingsContext'

export const useSettings = (): SettingsContextValue => useContext(SettingsContext)
