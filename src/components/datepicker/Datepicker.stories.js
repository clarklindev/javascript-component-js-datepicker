import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import Datepicker from './Datepicker';

storiesOf('Datepicker', module)
    .add('default',()=><Datepicker/>)