import React from "react";
import { ModalNames } from "./constants";
import { Modal } from "./Modal";
import { typedKeys } from "../draft/utils/common";

export type Component = React.ComponentClass<any> | React.FC<any>;

export type OnOpen = {
  component: Component;
  componentId: string;
  props?: { [key: string]: unknown };
};

type ModalState = {
  isOpen: boolean;
  props: Record<string, unknown>;
};

type State = Readonly<{ [id: string]: ModalState }>;

export class ModalFactory extends React.Component<
  Record<string, unknown>,
  State
> {
  static ref? = null as ModalFactory | null;
  readonly state: State = {};

  componentDidMount() {
    ModalFactory.ref = this;
  }

  componentWillUnmount() {
    delete ModalFactory.ref;
  }

  static open = (
    id: keyof typeof ModalNames,
    props: Record<string, unknown>
  ) => {
    const reference = ModalFactory.ref;

    if (reference) {
      reference.setState({
        [id]: { isOpen: true, props },
      });
    }
  };

  static close = (id: string) => {
    const reference = ModalFactory.ref;
    if (reference && id) {
      reference.setState((prevState) => {
        // Ensure the existing modal state is present for the given id
        if (!prevState[id]) {
          return prevState;
        }

        // Create a new state object that updates only the specified id
        const newState = {
          ...prevState,
          [id]: {
            ...prevState[id],
            isOpen: false,
            props: prevState[id]!.props, // Ensure all properties of ModalState are included
          },
        };
        return newState;
      });
    }
  };

  render() {
    const state = ModalFactory.ref?.state;
    const factoryIds = state && typedKeys(state);

    return (
      <>
        {state && factoryIds?.length
          ? factoryIds.map((modalId) => {
              const modalState = state[modalId];
              if (!modalState) return null;

              const { isOpen } = modalState;

              return isOpen ? (
                <Modal
                  key={modalId}
                  {...modalState.props}
                  onClose={() => ModalFactory.close(modalId as string)}
                  isOpen
                />
              ) : null;
            })
          : null}
      </>
    );
  }
}
