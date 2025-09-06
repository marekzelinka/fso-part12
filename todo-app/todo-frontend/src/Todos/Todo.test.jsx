import {render, screen} from '@testing-library/react'
import Todo from './Todo'

describe("<Todo />", () => {
  test("renders text", () => {
    render(<Todo 
      todo={{text: "Testing todo", done: false}}
      deleteTodo={() => {}}
      completeTodo={() => {}}
    />)

    expect(screen.getByText("Testing todo")).toBeInTheDocument()
  })
})