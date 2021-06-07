import { Injectable } from '@nestjs/common';
import base1 from '../../seed/base_annotation.json';
import base2 from '../../seed/base_device.json';
import base3 from '../../seed/base_sink.json';
import base4 from '../../seed/base_source.json';
import base5 from '../../seed/base_stream.json';
import base6 from '../../seed/data_api_value_sink.json';
import base7 from '../../seed/edge.json';
import base8 from '../../seed/generic_source.json';
import base9 from '../../seed/generic_stream.json';
import base10 from '../../seed/iot_hub_sink.json';
import base11 from '../../seed/ml-annotation.json';
import base12 from '../../seed/opcua_source.json';
import base13 from '../../seed/opcua_stream.json';
import base14 from '../../seed/proof_sink.json';
import base15 from '../../seed/rabbitmq_source.json';
import base16 from '../../seed/rabbitmq_stream.json';
import base20 from '../../seed/replay_value_source.json';
import base21 from '../../seed/replay_value_stream.json';
import base17 from '../../seed/simulated_value_source.json';
import base18 from '../../seed/simulated_value_stream.json';
import base19 from '../../seed/ssm.json';
import base22 from '../../seed/ssm_sink.json';
import base23 from '../../seed/ssm_source_air_quality.json';
import base24 from '../../seed/ssm_source_deviceinterfaceprotocol.json';
import base25 from '../../seed/ssm_source_modbus.json';
import base26 from '../../seed/ssm_source_xmc.json';
import base27 from '../../seed/ssm_stream_air_quality.json';
import base28 from '../../seed/ssm_stream_deviceinterfaceprotocol.json';
import base29 from '../../seed/ssm_stream_modbus.json';
import base30 from '../../seed/ssm_stream_xmc.json';
import { Interface } from '../models/models';
import { ModelService } from './model.service';

@Injectable()
export class ModelSeederService {
  constructor(private modelService: ModelService) {}

  seedDatabase() {
    this.modelService.addMany([
      base1 as Interface,
      base2 as Interface,
      base3 as Interface,
      base4 as Interface,
      base5 as Interface,
      base6 as Interface,
      base7 as Interface,
      base8 as Interface,
      base9 as Interface,
      base10 as Interface,
      base11 as Interface,
      base12 as Interface,
      base13 as Interface,
      base14 as Interface,
      base15 as Interface,
      base16 as Interface,
      base17 as Interface,
      base18 as Interface,
      base19 as Interface,
      base20 as Interface,
      base21 as Interface,
      base22 as Interface,
      base23 as Interface,
      base24 as Interface,
      base25 as Interface,
      base26 as Interface,
      base27 as Interface,
      base28 as Interface,
      base29 as Interface,
      base30 as Interface,
    ]);
  }
}
