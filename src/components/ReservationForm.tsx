import React, { useState, useEffect } from "react";
import { useCinemaStore, useSelectedSeat, toSeatId } from "../store/store";
import { clamp } from "../utilities/clamp";
import { SeatSelection } from "../store/store";

export function ReservationForm() {

  const state = useCinemaStore() // we are using entire Zustand state here anyway

  const buttonEnabled = state.selectedSeat.row && state.selectedSeat.column && !(toSeatId(state.selectedSeat.place, state.selectedSeat.column, state.selectedSeat.row) in state.reservedSeats)

  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'ground' | 'balcony'
    state.setSelectedSeat({ ...state.selectedSeat, place: value })
  }

  const numberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value ? clamp((Math.round(+e.target.value)), 1, state.seatingLayout[state.selectedSeat.place][name === 'row' ? 'rows' : 'columns']) : ''

    const newSelectionState = {
      ...state.selectedSeat,
      [name]: value
    }

    state.setSelectedSeat(newSelectionState)
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    state.selectedSeat.row && state.selectedSeat.column && state.reserveSeat(toSeatId(state.selectedSeat.place, state.selectedSeat.column, state.selectedSeat.row))
  }

  return (
    <div className='bigBox' >
      <button onClick={() => state.setPresentation('2d')} disabled={state.presentation === '2d'}>
        2D
      </button>
      <button onClick={() => state.setPresentation('3d')} disabled={state.presentation === '3d'}>
        3D
      </button>
      <button onClick={() => state.setPresentation('seat')} disabled={state.presentation === 'seat'}>
        Seat
      </button>
      <form onSubmit={submitHandler}>

        <br />
        <label>
          <input
            type="radio"
            id="ground"
            name="seatRadio"
            value="ground"
            onChange={radioHandler}
            checked={'ground' === state.selectedSeat.place} />
          Ground
        </label>
        <br />
        <label>
          <input
            type="radio"
            id="balcony"
            name="seatRadio"
            value="balcony"
            onChange={radioHandler}
            checked={'balcony' === state.selectedSeat.place}
          />  Balcony
        </label>
        <br />
        row: <br />
        <input
          name='row'
          value={state.selectedSeat.row}
          onChange={numberHandler}
          type='number'
        />
        <br />
        column: <br />
        <input
          name='column'
          value={state.selectedSeat.column}
          onChange={numberHandler}
          type='number'
        /><br />
        <button disabled={!buttonEnabled}>
          submit
        </button>
      </form>
    </div >
  )

}