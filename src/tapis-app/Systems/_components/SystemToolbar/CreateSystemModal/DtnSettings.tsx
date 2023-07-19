import { FormikInput, Collapse } from 'tapis-ui/_common';
import { FormikCheck } from 'tapis-ui/_common/FieldWrapperFormik';
import { useMemo } from 'react';
import { Systems } from '@tapis/tapis-typescript';
import { useFormikContext } from 'formik';

const DtnSettings: React.FC = () => {
  const { values } = useFormikContext();

  const isDtn = useMemo(
    () => (values as Partial<Systems.ReqPostSystem>).isDtn,
    [values]
  );
  const canExec = useMemo(
    () => (values as Partial<Systems.ReqPostSystem>).canExec,
    [values]
  );

  return (
    <div>
      {!canExec ? (
        <Collapse title="DTN Settings">
          <FormikCheck
            name="isDtn"
            required={false}
            label="Is DTN"
            description={'Decides if the system is a delay-tolerant network'}
          />
          {isDtn ? (
            <div>
              <FormikInput
                name="dtnSystemId"
                label="DTN System ID"
                required={false}
                description={`DTN system id`}
                aria-label="Input"
              />
              <FormikInput
                name="dtnMountPoint"
                label="DTN Mount Point"
                required={false}
                description={`DTN mount point`}
                aria-label="Input"
              />
              <FormikInput
                name="dtnMountSourcePath"
                label="DTN Mount Source Path"
                required={false}
                description={`DTN mount source path`}
                aria-label="Input"
              />
            </div>
          ) : null}
        </Collapse>
      ) : null}
    </div>
  );
};

export default DtnSettings;
