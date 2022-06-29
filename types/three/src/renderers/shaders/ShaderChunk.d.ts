// Renderers / Shaders /////////////////////////////////////////////////////////////////////
export let ShaderChunk: {
	[name: string]: string;

	alphamap_fragment: string;
	alphamap_pars_fragment: string;
	alphatest_fragment: string;
	aomap_fragment: string;
	aomap_pars_fragment: string;
	begin_vertex: string;
	beginnormal_vertex: string;
	bsdfs: string;
	bumpmap_pars_fragment: string;
	clipping_planes_fragment: string;
	clipping_planes_pars_fragment: string;
	clipping_planes_pars_vertex: string;
	clipping_planes_vertex: string;
	color_fragment: string;
	color_pars_fragment: string;
	color_pars_vertex: string;
	color_vertex: string;
	common: string;
	cube_frag: string;
	cube_vert: string;
	cube_uv_reflection_fragment: string;
	defaultnormal_vertex: string;
	depth_frag: string;
	depth_vert: string;
	distanceRGBA_frag: string;
	distanceRGBA_vert: string;
	displacementmap_vertex: string;
	displacementmap_pars_vertex: string;
	emissivemap_fragment: string;
	emissivemap_pars_fragment: string;
	encodings_pars_fragment: string;
	encodings_fragment: string;
	envmap_fragment: string;
	envmap_common_pars_fragment: string;
	envmap_pars_fragment: string;
	envmap_pars_vertex: string;
	envmap_vertex: string;
	equirect_frag: string;
	equirect_vert: string;
	fog_fragment: string;
	fog_pars_fragment: string;
	linedashed_frag: string;
	linedashed_vert: string;
	lightmap_fragment: string;
	lightmap_pars_fragment: string;
	lights_lambert_vertex: string;
	lights_pars_begin: string;
	envmap_physical_pars_fragment: string;
	lights_pars_map: string;
	lights_phong_fragment: string;
	lights_phong_pars_fragment: string;
	lights_physical_fragment: string;
	lights_physical_pars_fragment: string;
	lights_fragment_begin: string;
	lights_fragment_maps: string;
	lights_fragment_end: string;
	logdepthbuf_fragment: string;
	logdepthbuf_pars_fragment: string;
	logdepthbuf_pars_vertex: string;
	logdepthbuf_vertex: string;
	map_fragment: string;
	map_pars_fragment: string;
	map_particle_fragment: string;
	map_particle_pars_fragment: string;
	meshbasic_frag: string;
	meshbasic_vert: string;
	meshlambert_frag: string;
	meshlambert_vert: string;
	meshphong_frag: string;
	meshphong_vert: string;
	meshphysical_frag: string;
	meshphysical_vert: string;
	metalnessmap_fragment: string;
	metalnessmap_pars_fragment: string;
	morphnormal_vertex: string;
	morphtarget_pars_vertex: string;
	morphtarget_vertex: string;
	normal_flip: string;
	normal_frag: string;
	normal_fragment_begin: string;
	normal_fragment_maps: string;
	normal_vert: string;
	normalmap_pars_fragment: string;
	clearcoat_normal_fragment_begin: string;
	clearcoat_normal_fragment_maps: string;
	clearcoat_pars_fragment: string;
	packing: string;
	points_frag: string;
	points_vert: string;
	shadow_frag: string;
	shadow_vert: string;

	premultiplied_alpha_fragment: string;
	project_vertex: string;
	roughnessmap_fragment: string;
	roughnessmap_pars_fragment: string;
	shadowmap_pars_fragment: string;
	shadowmap_pars_vertex: string;
	shadowmap_vertex: string;
	shadowmask_pars_fragment: string;
	skinbase_vertex: string;
	skinning_pars_vertex: string;
	skinning_vertex: string;
	skinnormal_vertex: string;
	specularmap_fragment: string;
	specularmap_pars_fragment: string;
	tonemapping_fragment: string;
	tonemapping_pars_fragment: string;
	uv2_pars_fragment: string;
	uv2_pars_vertex: string;
	uv2_vertex: string;
	uv_pars_fragment: string;
	uv_pars_vertex: string;
	uv_vertex: string;
	worldpos_vertex: string;
};
