var httpMicroServiceExample = {
	source: {
		appId: "maps",
		service: "tile-server",
		serviceGroup: "alerts-and-obs",
		serverId: "alerts-and-obs-v1111-4wbd9",
		meta: {
			version: "v1111"
		}
	},
	details: {
		type: "HTTP",
		requestId: "some-guid-c64d-4160-a137-fa420bfeee12",
		method: "GET",
		requestUrl: "http://localhost/hello/world?foo=bar",
		startTime: 143235435354,
		duration: 0.12132,
		responseCode: 200,
		contentLength: 34325,
		additionalHeaders: {

		},
		requestBody: {

		},
		meta: {

		}
	}
};

var generalLog = {
	source: {
		appId: "maps",
		service: "tile-server",
		serviceGroup: "alerts-and-obs",
		serverId: "alerts-and-obs-v1111-4wbd9",
		meta: {
			version: "v1111"
		}
	},
	details: {
		type: "GENERAL",
		level: 0,
		message: "Er mah gerd",
		time: 143235435354,
		meta: {

		}
	}
};

var eventLog = {
	source: {
		appId: "maps",
		service: "tile-server",
		serviceGroup: "alerts-and-obs",
		serverId: "alerts-and-obs-v1111-4wbd9",
		meta: {
			version: "v1111"
		}
	},
	details: {
		type: "EVENT",
		event: "MyEvent",
		seriesId: "f788cb65-c64d-4160-a137-fa420bfeee12",
		meta: {

		}
	}
};