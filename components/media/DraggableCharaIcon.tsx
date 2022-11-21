import { AttributeType, CardType } from 'hoshimi-venus/out/types/proto/proto_enum';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CharaIcon from './CharaIcon';

export default function DraggableCharaIcon({ cardId, role, attribute, onClick }:
  { cardId: string, role: CardType, attribute: AttributeType, onClick?: () => void }) {
  return (
    <>
      <DragDropContext
        onDragEnd={() => { }}
      >
        <Droppable
          droppableId='drop123'
        >
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable
                key={cardId}
                draggableId={cardId}
                index={0}
              >
                {(provided, snapshot) => (
                  <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <CharaIcon cardId={cardId} role={role} attribute={attribute} />
                  </div>
                )}
              </Draggable>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}