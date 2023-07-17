import { Button, Input, FormGroup, Label } from 'reactstrap';
import { GenericModal } from 'tapis-ui/_common';
import { SubmitWrapper } from 'tapis-ui/_wrappers';
import { ToolbarModalProps } from '../SystemToolbar';
import { Form, Formik } from 'formik';
import { FormikInput } from 'tapis-ui/_common';
import { FormikSelect, FormikCheck } from 'tapis-ui/_common/FieldWrapperFormik';
import { useMakeNewSystem } from 'tapis-hooks/systems';
import { useEffect, useCallback, useState } from 'react';
import styles from './CreateSystemModal.module.scss';
import * as Yup from 'yup';
import {
  SystemTypeEnum,
  AuthnEnum,
  RuntimeTypeEnum,
  SchedulerTypeEnum,
} from '@tapis/tapis-typescript-systems';
import { useQueryClient } from 'react-query';
import { default as queryKeys } from 'tapis-hooks/systems/queryKeys';
import AdvancedSettings from './AdvancedSettings';

//Arrays that are used in the drop-down menus
const systemTypes = Object.values(SystemTypeEnum);
const authnMethods = Object.values(AuthnEnum);

const CreateSystemModal: React.FC<ToolbarModalProps> = ({ toggle }) => {
  //Allows the system list to update without the user having to refresh the page
  const queryClient = useQueryClient();
  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries(queryKeys.list);
  }, [queryClient]);

  const { makeNewSystem, isLoading, error, isSuccess, reset } =
    useMakeNewSystem();

  useEffect(() => {
    reset();
  }, [reset]);

  const [simplified, setSimplified] = useState(false);
  const onChange = useCallback(() => {
    setSimplified(!simplified);
  }, [setSimplified, simplified]);

  const validationSchema = Yup.object({
    sysname: Yup.string()
      .min(1)
      .max(80, 'System name should not be longer than 80 characters')
      .matches(
        /^[a-zA-Z0-9_.-]+$/,
        "Must contain only alphanumeric characters and the following: '.', '_', '-'"
      )
      .required('System name is a required field'),
    description: Yup.string().max(
      2048,
      'Description schould not be longer than 2048 characters'
    ),
    host: Yup.string()
      .min(1)
      .max(256, 'Host name should not be longer than 256 characters')
      .matches(
        /^[a-zA-Z0-9_.-]+$/,
        "Must contain only alphanumeric characters and the following: '.', '_', '-'"
      )
      .required('Host name is a required field'),
    rootDir: Yup.string()
      .min(1)
      .max(4096, 'Root Directory should not be longer than 4096 characters'),
    jobWorkingDir: Yup.string()
      .min(1)
      .max(
        4096,
        'Job Working Directory should not be longer than 4096 characters'
      ),
    effectiveUserId: Yup.string()
      .min(1)
      .max(60, 'Effective User ID should not be longer than 60 characters'),
    batchSchedulerProfile: Yup.string()
      .min(1)
      .max(
        80,
        'Batch Scheduler Profile should not be longer than 80 characters'
      ),
    batchDefaultLogicalQueue: Yup.string()
      .min(1)
      .max(
        128,
        'Batch Default Logical Queue should not be longer than 128 characters'
      ),
  });

  const initialValues = {
    sysname: '',
    description: '',
    systemType: SystemTypeEnum.Linux,
    host: 'stampede2.tacc.utexas.edu',
    defaultAuthnMethod: AuthnEnum.Password,
    canExec: true,
    rootDir: '/',
    jobWorkingDir: 'HOST_EVAL($SCRATCH)',
    jobRuntimes: RuntimeTypeEnum.Singularity,
    effectiveUserId: '${apiUserId}',
    canRunBatch: true,
    batchScheduler: SchedulerTypeEnum.Slurm,
    batchSchedulerProfile: 'tacc',
    batchDefaultLogicalQueue: 'tapisNormal',
    batchLogicalQueuesName: 'tapisNormal',
    hpcQueueName: 'normal',
    maxJobs: 50,
    maxJobsPerUser: 10,
    minNodeCount: 1,
    maxNodeCount: 16,
    minCoresPerNode: 1,
    maxCoresPerNode: 68,
    minMemoryMB: 1,
    maxMemoryMB: 16384,
    minMinutes: 1,
    maxMinutes: 60,
  };

  const onSubmit = ({
    sysname,
    description,
    systemType,
    host,
    defaultAuthnMethod,
    canExec,
    rootDir,
    jobWorkingDir,
    jobRuntimes,
    effectiveUserId,
    canRunBatch,
    batchScheduler,
    batchSchedulerProfile,
    batchDefaultLogicalQueue,
    batchLogicalQueuesName,
    hpcQueueName,
    maxJobs,
    maxJobsPerUser,
    minNodeCount,
    maxNodeCount,
    minCoresPerNode,
    maxCoresPerNode,
    minMemoryMB,
    maxMemoryMB,
    minMinutes,
    maxMinutes,
  }: {
    sysname: string;
    description: string;
    systemType: SystemTypeEnum;
    host: string;
    defaultAuthnMethod: AuthnEnum;
    canExec: boolean;
    rootDir: string;
    jobWorkingDir: string;
    jobRuntimes: RuntimeTypeEnum;
    effectiveUserId: string;
    canRunBatch: boolean;
    batchScheduler: SchedulerTypeEnum;
    batchSchedulerProfile: string;
    batchDefaultLogicalQueue: string;

    //batchLogicalQueues
    batchLogicalQueuesName: string;
    hpcQueueName: string;
    maxJobs: number;
    maxJobsPerUser: number;
    minNodeCount: number;
    maxNodeCount: number;
    minCoresPerNode: number;
    maxCoresPerNode: number;
    minMemoryMB: number;
    maxMemoryMB: number;
    minMinutes: number;
    maxMinutes: number;
  }) => {
    //Converting the string into a boolean value
    const jobRuntimesArray = [{ runtimeType: jobRuntimes }];
    const batchLogicalQueues = [
      {
        name: batchLogicalQueuesName,
        hpcQueueName,
        maxJobs,
        maxJobsPerUser,
        minNodeCount,
        maxNodeCount,
        minCoresPerNode,
        maxCoresPerNode,
        minMemoryMB,
        maxMemoryMB,
        minMinutes,
        maxMinutes,
      },
    ];
    console.log(canExec);
    //Creating the new system
    makeNewSystem(
      {
        id: sysname,
        description,
        systemType,
        host,
        defaultAuthnMethod,
        canExec,
        rootDir,
        jobWorkingDir,
        jobRuntimes: jobRuntimesArray,
        effectiveUserId,
        canRunBatch,
        batchScheduler,
        batchSchedulerProfile,
        batchDefaultLogicalQueue,
        batchLogicalQueues,
      },
      true,
      { onSuccess }
    );
  };

  return (
    <GenericModal
      toggle={toggle}
      className={simplified ? styles['advanced-settings'] : styles['simplified-settings']}
      title="Create New System"
      body={
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form id="newsystem-form">
                <FormGroup check>
                  <Label check size="sm" className={`form-field__label`}>
                    <Input type="checkbox" onChange={onChange} />
                    Advanced Settings
                  </Label>
                </FormGroup>
                <FormikInput
                  name="sysname"
                  label="System Name"
                  required={true}
                  description={`System name`}
                  aria-label="Input"
                />
                <FormikInput
                  name="description"
                  label="Description"
                  required={false}
                  description={`System description`}
                  aria-label="Input"
                />
                <FormikSelect
                  name="systemType"
                  description="The system type"
                  label="System Type"
                  required={true}
                  data-testid="systemType"
                >
                  <option disabled value={''}>
                    Select a system type
                  </option>
                  {systemTypes.map((values) => {
                    return <option>{values}</option>;
                  })}
                </FormikSelect>
                <FormikInput
                  name="host"
                  label="Host"
                  required={true}
                  description={`Host of the system`}
                  aria-label="Input"
                />
                <FormikSelect
                  name="defaultAuthnMethod"
                  description="Authentication method for the system"
                  label="Default Authentication Method"
                  required={true}
                  data-testid="defaultAuthnMethod"
                >
                  <option disabled value="">
                    Select a default athenication method
                  </option>
                  {authnMethods.map((values) => {
                    return <option>{values}</option>;
                  })}
                </FormikSelect>
                <FormikCheck
                  name="canExec"
                  required={true}
                  label="Can Execute"
                  description={'Decides if the system can execute'}
                />
                <AdvancedSettings simplified={simplified} />
              </Form>
            )}
          </Formik>
        </div>
      }
      footer={
        <SubmitWrapper
          className={styles['modal-footer']}
          isLoading={isLoading}
          error={error}
          success={isSuccess ? `Successfully created a new system` : ''}
          reverse={true}
        >
          <Button
            form="newsystem-form"
            color="primary"
            disabled={isLoading || isSuccess}
            aria-label="Submit"
            type="submit"
          >
            Create a new system
          </Button>
        </SubmitWrapper>
      }
    />
  );
};

export default CreateSystemModal;
