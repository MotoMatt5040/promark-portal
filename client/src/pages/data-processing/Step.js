import React, { useState, useEffect } from 'react';
import Step1 from './sidebar instruction steps/Step1';
import Step2 from './sidebar instruction steps/Step2';
import Step3 from './sidebar instruction steps/Step3';
import Step4 from './sidebar instruction steps/Step4';
import Step5 from './sidebar instruction steps/Step5';
import Step6 from './sidebar instruction steps/Step6';
import Step7 from './sidebar instruction steps/Step7';
import Step8 from './sidebar instruction steps/Step8';
import Step9 from './sidebar instruction steps/Step9';
import Step10 from './sidebar instruction steps/Step10';
import Step11 from './sidebar instruction steps/Step11';

const Step = ({ selectedSection }) => {

  switch (selectedSection) {
    case 'create-order':
      return <Step1 />;
    case 'create-directories':
      return <Step2 />;
    case 'enter-survey-id':
      return <Step3 />;
    case 'click-checkboxes':
      return <Step4 />;
    case 'click-download':
      return <Step5 />;
    case 'create-project':
      return <Step6 />;
    case 'run-usort':
      return <Step7 />;
    case 'uncle-setup':
      return <Step8 />;
    case 'uncle-setup/options':
      return <Step8 defaultActiveKeys={Object({parent: '8-1'})}/>;
    case 'uncle-setup/options/copy':
      return <Step8 defaultActiveKeys={Object({parent: '8-1', child: '8-1-1'})}/>;
    case 'uncle-setup/options/create':
      return <Step8 defaultActiveKeys={Object({parent: '8-1', child: '8-1-2'})}/>;
    case 'uncle-setup/adjust':
      return <Step8 defaultActiveKeys={Object({parent: '8-2'})}/>;
    case 'uncle-setup/default-table-scripts':
      return <Step8 defaultActiveKeys={Object({parent: '8-3'})}/>;
    case 'table-cleanup':
      return <Step9/>;
    case 'table-cleanup/indentations':
      return <Step9 defaultActiveKeys={Object({parent: '9-1'})}/>;
    case 'table-cleanup/no-answer':
      return <Step9 defaultActiveKeys={Object({parent: '9-2'})}/>;
    case 'table-cleanup/qualifiers':
      return <Step9 defaultActiveKeys={Object({parent: '9-3'})}/>;
    case 'table-cleanup/ranks':
      return <Step9 defaultActiveKeys={Object({parent: '9-4'})}/>;
    case 'stub-checking':
      return <Step10/>;
    case 'stub-checking/table-order':
      return <Step10 defaultActiveKeys={Object({parent: '10-1'})}/>;
    case 'stub-checking/qualifiers':
      return <Step10 defaultActiveKeys={Object({parent: '10-2'})}/>;
    case 'stub-checking/verify-numbers':
      return <Step10 defaultActiveKeys={Object({parent: '10-3'})}/>;
    case 'stub-checking/verify-numbers/basic-tables':
      return <Step10 defaultActiveKeys={Object({parent: '10-3', child: '10-3-1'})}/>;
    case 'stub-checking/verify-numbers/total-tables':
      return <Step10 defaultActiveKeys={Object({parent: '10-3', child: '10-3-2'})}/>;
    case 'stub-checking/verify-numbers/multi-choice-tables':
      return <Step10 defaultActiveKeys={Object({parent: '10-3', child: '10-3-3'})}/>;
    case 'stub-checking/segmentation':
      return <Step10 defaultActiveKeys={Object({parent: '10-4'})}/>;
    case 'stub-checking/segmentation/help':
      return <Step10 defaultActiveKeys={Object({parent: '10-4', child: '10-4-1'})}/>;
    case 'stub-checking/segmentation/extraction':
      return <Step10 defaultActiveKeys={Object({parent: '10-4', child: '10-4-2'})}/>;
    case 'stub-checking/segmentation/typing-tool':
      return <Step10 defaultActiveKeys={Object({parent: '10-4', child: '10-4-3'})}/>;
    case 'stub-checking/segmentation/create-table':
      return <Step10 defaultActiveKeys={Object({parent: '10-4', child: '10-4-4'})}/>;
    case 'banner-setup':
      return <Step11/>;
    case 'banner-setup/basics':
      return <Step11 defaultActiveKeys={Object({parent: '11-1'})}/>;
    case 'banner-setup/example-1':
      return <Step11 defaultActiveKeys={Object({parent: '11-2'})}/>;
    case 'banner-setup/example-2':
      return <Step11 defaultActiveKeys={Object({parent: '11-3'})}/>;
  }

  return (
    <div>Loading...</div>
  )
}

export default Step;