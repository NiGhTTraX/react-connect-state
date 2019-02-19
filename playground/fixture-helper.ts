import { ComponentType } from 'react';

export type Fixture<Props> = {
  component: ComponentType<Props>,
  props: Props
};

export default function createFixture<Props>(
  Component: ComponentType<Props>,
  props: Props
): Fixture<Props> {
  return {
    component: Component,
    props
  };
}

export function extendFixture<Props>(base: Fixture<Props>, props: Partial<Props>): Fixture<Props> {
  return Object.assign({}, base, {
    props: { ...base.props, ...props }
  });
}
