import React from 'react';
import { Alert, Flex, FlexItem, FormGroup } from '@patternfly/react-core';
import { BaseModelFormData } from '~/concepts/pipelines/content/modelCustomizationForm/modelCustomizationFormSchema/validationUtils';
import {
  FineTunePageSections,
  fineTunePageSectionTitles,
} from '~/pages/pipelines/global/modelCustomization/const';
import { ODH_PRODUCT_NAME } from '~/utilities/const';
import { ValidationContext } from '~/utilities/useValidation';
import { ZodErrorHelperText } from '~/components/ZodErrorFormHelperText';
import FormSection from '~/components/pf-overrides/FormSection';
import InlineEditText from './InlineEditText';

const RED_HAT_REGISTRY_PREFIX = 'registry.redhat.io';
const FIELD_ID_PREFIX = 'model-customization-baseModel';

type BaseModelSectionProps = {
  data: BaseModelFormData;
  setData: (data: BaseModelFormData) => void;
  registryName?: string;
  inputModelName?: string;
  inputModelVersionName?: string;
};

const BaseModelSection: React.FC<BaseModelSectionProps> = ({
  data,
  setData,
  registryName,
  inputModelName,
  inputModelVersionName,
}) => {
  const { getAllValidationIssues } = React.useContext(ValidationContext);
  const validationIssues = data.sdgBaseModel
    ? getAllValidationIssues(['baseModel', 'sdgBaseModel'])
    : [];
  const hasValidationIssues = validationIssues.length > 0;
  return (
    <FormSection
      id={FineTunePageSections.BASE_MODEL}
      title={fineTunePageSectionTitles[FineTunePageSections.BASE_MODEL]}
      description="The pre-trained model that the fine-tuning run will further refine."
    >
      <Flex>
        <FlexItem>
          <Alert
            isInline
            isExpandable
            variant="info"
            title={`${ODH_PRODUCT_NAME} supports InstructLab fine-tuning for only specific models.`}
          >
            Supported models are indicated by the InstructLab-tunable label in the model catalog.
            Fine-tuning unsupported models might result in unsatisfactory results.
          </Alert>
        </FlexItem>
      </Flex>
      <FormGroup label="Model registry name" fieldId={`${FIELD_ID_PREFIX}-registryName`}>
        <div data-testid="base-registry-name">{registryName ?? '-'}</div>
      </FormGroup>
      <FormGroup label="Model name" fieldId={`${FIELD_ID_PREFIX}-name`}>
        <div data-testid="base-model-name">{inputModelName ?? '-'}</div>
      </FormGroup>
      <FormGroup label="Model version" fieldId={`${FIELD_ID_PREFIX}-version`}>
        <div data-testid="base-model-version">{inputModelVersionName ?? '-'}</div>
      </FormGroup>
      <FormGroup
        label="Model input storage location URI"
        fieldId={`${FIELD_ID_PREFIX}-inputStorageLocationUri`}
        isRequired
        data-testid="base-model-uri"
      >
        <InlineEditText
          onSave={(text) => {
            setData({ ...data, sdgBaseModel: text });
          }}
          checkSupported={(text) => text.startsWith(`${RED_HAT_REGISTRY_PREFIX}/`)}
          text={data.sdgBaseModel}
          unsupportedMessage={`This feature is a technology preview. At this time, this form supports only models sourced from the catalog in Red Hat Registry (${RED_HAT_REGISTRY_PREFIX}). To learn how to LAB-tune an unsupported model, refer to the documentation.`}
          validated={hasValidationIssues ? 'error' : 'default'}
        />
        <ZodErrorHelperText zodIssue={validationIssues} />
      </FormGroup>
    </FormSection>
  );
};

export default BaseModelSection;
