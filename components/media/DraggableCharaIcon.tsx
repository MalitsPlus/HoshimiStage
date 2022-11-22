import { AttributeType, CardType } from 'hoshimi-venus/out/types/proto/proto_enum';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CharaIcon from './CharaIcon';

export default function DraggableCharaIcon({ cid, aid, index, role, attribute, onCharaClick, onDragged }: {
  cid: string, aid: string, index: number, role: CardType, attribute: AttributeType,
  onCharaClick: (id: string) => void,
  onDragged: (source: number, destination?: number) => void
}) {
  return (
    <>
      <Droppable droppableId={'droppable-' + cid}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
          >
            <Draggable
              draggableId={'draggable-' + cid}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className={snapshot.isDragging ? "shadow" : ""}
                >
                  <CharaIcon cid={cid} aid={aid} role={role} attribute={attribute} onCharaClick={onCharaClick} />
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  )
}