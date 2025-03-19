import React from "react";
import { useCinemaStore, toSeatId, useSelectedSeat } from "../store/store";
import { arrayRange } from "../utilities/arrayRange";
import { useCallback } from "react";

export function SeatingFloor() {
  const seatingLayout = useCinemaStore((state) => state.seatingLayout)
  const reservedSeats = useCinemaStore((state) => state.reservedSeats)
  const takenSeats = useCinemaStore((state) => state.takenSeats)
  const selectedSeat = useCinemaStore((state) => state.selectedSeat)

  const { columns, rows } = seatingLayout[selectedSeat.place]
  const selection = useSelectedSeat()

  const selectedSeatID = selection ? toSeatId(selectedSeat.place, selectedSeat.column || 1, selectedSeat.row || 1) : null
  return (
    <div className='mainContainer'>
        <table className='mainTable'>
          <tbody>
            <tr>
              <td>
              </td>
              {arrayRange(1, columns).map((valueColumn) => <td key={`td${valueColumn}`}>{valueColumn}</td>)}
            </tr>
            {arrayRange(1, rows).map((valueRow) =>
              <tr key={valueRow}>
                <td>
                  {valueRow}
                </td>
                {arrayRange(1, columns).map((valueColumn) =>
                  <td key={toSeatId(selectedSeat.place, valueColumn, valueRow)}>
                    <Seat
                      isReserved={toSeatId(selectedSeat.place, valueColumn, valueRow) in reservedSeats}
                      isSelected={!!selection && toSeatId(selectedSeat.place, valueColumn, valueRow) === selectedSeatID}
                      isTaken={toSeatId(selectedSeat.place, valueColumn, valueRow) in takenSeats}
                      row={valueRow}
                      column={valueColumn}
                      seatingGroup={selectedSeat.place}
                    />
                  </td>
                )}
              </tr>)}
          </tbody>
        </table>
    </div>
  )
}

function Seat({ isReserved = false, isTaken= false, isSelected = false, row, column, seatingGroup = 'ground', }: { isReserved: boolean, isSelected: boolean, isTaken: boolean, row: number, column: number, seatingGroup: 'ground' | 'balcony' }) {
  const reserveSeat = useCinemaStore((state) => state.reserveSeat)
  const setSelectedSeat = useCinemaStore((state) => state.setSelectedSeat)
  const seatID = toSeatId(seatingGroup, column, row)
  const classes = (isSelected ? 'selectedButton seatButton' : (isReserved ? 'seatReserved seatButton' : 'seatNotSelected seatButton'))
  return <button className={classes} disabled={isTaken} onClick={() => setSelectedSeat({ place: seatingGroup, column, row })}>_</button>
}
