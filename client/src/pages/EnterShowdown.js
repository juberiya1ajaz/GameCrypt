import React from 'react'
import { Bar } from '../components/Bar'
import { EndMenue } from '../components/EndMenue'
import { Menue } from '../components/Menue'
import { PlayerSummary } from '../components/PlayerSummary'
import { Showdown } from '../components/Showdown'
import { ShowdownAnnouncer } from '../components/ShowdownAnnouncer'
import { ShowdownMenue } from '../components/ShowdownMenue'
import { Start } from '../components/Start'

export default function EnterShowdown() {
  return (
    <div>
      <Bar />
      <EndMenue />
      <Menue />
      <PlayerSummary />
      <Showdown />
      <ShowdownAnnouncer />
      <ShowdownMenue />
      <Start />
    </div>
  )
}
